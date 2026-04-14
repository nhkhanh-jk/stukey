const jwt = require("jsonwebtoken")
const authService = require("../services/authService");
const {
    generateAccessToken,
    generateRefreshToken,
    REFRESH_SECRET,
} = require("../utils/generateToken");
const User = require("../models/User");

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: 30*24*60*60*1000,
    path: "/",
};
// POST /api/auth/login
// Public
const loginUser = async(req, res, next) => {
    try{
        const {email, password} = req.body;
        const user = await authService.loginUser(email, password);

        if(user) {
            const accessToken = generateAccessToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
            res.json({
                data: {
                    _id : user._id,
                    name : user.name,
                    email: user.email,
                    phone: user.phone,
                    addrress : user.address,
                    role: user.role,
                    createdAt: user.createdAt,
                    accessToken,
                },
            });
        } else{
            res.status(401);
            const error = new Error("Invalid email or password");
            throw error;
        }
    } catch(err){
        next(err);
    }
};
// POST /api/auth/register
// Public
const registerUser = async(req, res, next)=>{
    try{
        const {name, email, password, role} = req.body;

        if(!name || !email || !password){
            res.status(400);
            throw new Error("Name, email, password are required");
        }

        const user = await authService.registerUser({name, email, password, role,});

        res.status(201).json({
            message: "User created successful",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                createdAt: user.createdAt,
            },
        });
    }catch(err){
        next(err);
    }
};
// GET /api/auth/me
// private
const getMe = async(req, res)=>{
    const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    phone: req.user.phone,
    address: req.user.address,
    createdAt: req.user.createdAt,
    };
    res.json({data: user});
};

// PUT /api/auth/profile
// private
const updateProfile = async (req, res, next) => {
    try {
        const updatedUser = await authService.updateProfile(req.user._id, req.body);
        res.json({
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
                address: updatedUser.address,
                createdAt: updatedUser.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/auth/change-password
// private
const changePassword = async (req, res, next) => {
    try {
        const {currentPassword, newPassword} = req.body;
        if (!currentPassword || !newPassword){
            res.status(400);
            throw new Error("Current and new password are required");
        }

        await authService.changePassword(req.user._id, currentPassword, newPassword);
        res.json({message: "Password updated successfully"});
    } catch (error) {
        next(error);
    }
};

// DELETE /api/auth/account
const deleteAccount = async (req, res, next) => {
    try {
        await authService.deleteAccount(req.user._id);
        res.status(204).end();
    } catch (error) {
        next(error)
    }
};

// POST /api/auth/refresh-token
const refreshAccessToken = async (req, res, next) => {
    try {
        const token = req.cookie?.refreshToken;
        
        if(!token){
            res.status(401);
            throw new Error("No refresh token provided");
        }

        let decode;
        try {
            decode = jwt.verify(token, REFRESH_SECRET);
        } catch (error) {
            res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
            res.status(401);
            throw new Error("Invalid or expried refresh token");
        }

        const user = await User.findById(decode.id).select("-passwordHash");
        if(!user){
            res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
            res.status(401);
            throw new Error("User no longer exist");
        }

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);

        res.json({
            data: {
                accessToken: newAccessToken,
            },
        });

    } catch (error) {
        next(error);
    }
};

// POST /api/auth/logout
// Public

const logoutUser = async (req, res) => {
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    res.json({message: "Logged out sucessfully"});
}
module.exports = {
  loginUser,
  registerUser,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
  refreshAccessToken,
  logoutUser,        
}
