const logger = require("../utils/logger");

const errorHandler = (error, req, res, next) => {
    logger.error({
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method
    });

    let statusCode = error.statusCode || error.status || 500;
    let message = error.message || "Server Error";
    // 1. JWT errors
if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
}
else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
}
else if (error.name === "NotBeforeError") {
    statusCode = 401;
    message = "Token not active";
}
// 2. Mongoose CastError
else if (error.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${error.path}: ${error.value}`;
    }
    // 3. Mongoose ValidationError
    else if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors)
            .map((val) => val.message)
            .join(", ");
    }
    // 4. Mongoose Duplicate Key Error (code 11000)
    else if (error.code === 11000) {
        statusCode = 409;
        const fields = error.keyValue ? Object.keys(error.keyValue).join(", ") : "field";
        message = `Duplicate field value entered: ${fields}`;
    }
    // 5. Multer file size limit
    else if (error.code === "LIMIT_FILE_SIZE") {
        statusCode = 400;
        message = "File size limit exceeded. Maximum allowed size is 2MB";
    }
    // 6. Multer general error
    else if (error.name === "MulterError") {
        statusCode = 400;
        message = error.message;
    }
    // 7. Custom upload fileFilter error
    else if (error.message === "Only images are allowed") {
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message: process.env.NODE_ENV === "production" && statusCode === 500
            ? "Server Error"
            : message
    });
};

module.exports = errorHandler;
