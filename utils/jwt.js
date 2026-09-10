const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
};

const generateRefreshToken = (userId) => {
    return jwt.sign(
        {
            id: userId,
            type: "refresh",
            random: Date.now()
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
        }
    );
};

module.exports = {
    generateAccessToken,
    generateRefreshToken
};