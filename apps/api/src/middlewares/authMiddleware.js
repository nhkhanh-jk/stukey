const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;
    
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decode.id).select("-passwordHash");
            return next()
        } catch (error) {
            res.status(401);
            return next(new Error("Not authorized, token failed"));
        }
        
    }

    if(!token){
        res.status(401);
        return next(new Error("Not authorized, no token"));
    }
};

const authorize = (...roles) => {
    return(req, res, next) => {
        if(!req.user || !roles.includes(req.user.role)){
            res.status(403);
            return(next(
                new Error(`User role ${req.user?.role || "unknow"} is not authorized to this`)
            ));
        }
        next()
    };
};

module.exports = {
    protect,
    authorize,
};