const jwt = require("jsonwebtoken");

// token for access and refresh
const generateAccessToken = (id)=>{
    return jwt.sign({id, type: "access"}, process.env.JWT_SECRET, {
        expiresIn: "2h",
    });
};

const generateRefreshToken = (id)=>{
    return jwt.sign({id, type: "refresh"}, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30d"
    })
}
module.exports = {
    generateAccessToken,
    generateRefreshToken,
    REFRESH_SECRET
};