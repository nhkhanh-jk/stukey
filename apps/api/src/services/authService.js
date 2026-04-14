const bcrypt = require("bcryptjs");
const User = require("../models/User");

const loginUser = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) {
        return null;
    }
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return null;
    }
    return user;
};

const registerUser = async ({name, email, password, role}) => {
    const existingUser = await User.findOne({email});
    if (existingUser) {
        const error = new Error("Email already exists");
        error.statusCode = 400;
        throw error;
    }                                                                                     

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    return User.create({
        name, 
        email,
        passwordHash,
        role : role || "student",
    });
};

const updateProfile = async (userID, payload)=>{
    const user = await User.findById(userID);
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    if (payload.name !== undefined) user.name = payload.name;
    if (payload.phone !== undefined) user.phone = payload.phone;
    if (payload.address !== undefined) user.address = payload.address;
    return user.save();
};

const changePassword = async (userID, currentPassword, newPassword) => {
    const user = await User.findById(userID);
    if (!user){
        const error = new Error("User not found");
        error.statusCode(404);
        throw error;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
        const error = new Error("Password is incorrect");
        error.statusCode = 400;
        throw error;
    }
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    return user.save();
};

const deleteAccount = async (userID) => {
    const user = await User.findById(userID);
    if(!user){
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    await user.deleteOne();
    return true;
};

module.exports = {
    loginUser,
    registerUser,
    updateProfile,
    changePassword,
    deleteAccount,
};