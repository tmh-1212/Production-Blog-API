const ms = require("ms");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRepository = require("../repositories/userRepository");
const refreshTokenService = require("./refreshTokenService");
const sessionRepository = require("../repositories/sessionRepository");

const sendVerificationEmail =
    require("../utils/sendVerificationEmail");

const sendResetPasswordEmail =
    require("../utils/sendResetPasswordEmail");

const User = require("../models/User");

const {
    generateAccessToken,
    generateRefreshToken
} = require("../utils/jwt");


// ======================================================
// REGISTER
// ======================================================

const register = async (data) => {

    // 1. Check if email already exists
    const existingUser =
        await userRepository.findByEmail(data.email);

    if (existingUser) {

        const error = new Error(
            "Email already exists"
        );

        error.statusCode = 409;

        throw error;
    }


    // 2. Generate email verification token
    const verificationToken =
        crypto
            .randomBytes(32)
            .toString("hex");


    // 3. Save verification information
    data.emailVerificationToken =
        verificationToken;

    data.emailVerificationExpires =
        new Date(Date.now() + 60 * 60 * 1000);


    // IMPORTANT:
    // New users must verify their email and always receive user role
    data.emailVerified = false;
    data.role = "user";

    // 4. Create user
    const user =
        await userRepository.create(data);


    // 5. Send verification email
    await sendVerificationEmail(user);


    // 6. Generate JWT tokens
    const accessToken =
        generateAccessToken(user._id);

    const refreshToken =
        generateRefreshToken(user._id);


    // 7. Calculate refresh token expiration
    const expiresAt =
        new Date(
            Date.now() +
            ms(process.env.REFRESH_TOKEN_EXPIRES_IN)
        );


    // 8. Save refresh token
    await refreshTokenService.saveToken(
        user._id,
        refreshToken,
        expiresAt
    );



    // 9. Remove password before sending response
    const userObject =
        user.toObject();

    delete userObject.password;


    // 10. Return response
    return {

        message:
            "Registration successful. Check your email to verify account.",

        user: userObject,

        accessToken,

        refreshToken
    };
};


// ======================================================
// LOGIN
// ======================================================

const login = async (email, password) => {

    // 1. Find user
    const user =
        await userRepository.findByEmail(email);


    // 2. User doesn't exist
    if (!user) {

        const error =
            new Error("Invalid credentials");

        error.statusCode = 401;

        throw error;
    }


    // 3. Check email verification
    if (!user.emailVerified) {

        const error =
            new Error(
                "Please verify your email first"
            );

        error.statusCode = 403;

        throw error;
    }


    // 4. Compare password
    const isMatch =
        await user.comparePassword(password);


    if (!isMatch) {

        const error =
            new Error("Invalid credentials");

        error.statusCode = 401;

        throw error;
    }


    // 5. Check if account is blocked
    if (user.status === "blocked") {

        const error =
            new Error("Account is blocked");

        error.statusCode = 403;

        throw error;
    }


    // 6. Generate tokens
    const accessToken =
        generateAccessToken(user._id);

    const refreshToken =
        generateRefreshToken(user._id);


    // 6. Refresh token expiration
    const expiresAt =
        new Date(
            Date.now() +
            ms(process.env.REFRESH_TOKEN_EXPIRES_IN)
        );


    // 7. Save refresh token
    await refreshTokenService.saveToken(
        user._id,
        refreshToken,
        expiresAt
    );




    // 8. Create session
    await sessionRepository.create({

        user: user._id,

        refreshToken,

        ipAddress: "",

        userAgent: "",

        device: "",

        browser: "",

        os: "",

        current: true,

        lastActivity: new Date(),

        expiresAt
    });


    // 9. Remove password
    const userObject =
        user.toObject();

    delete userObject.password;


    // 10. Return login data
    return {

        user: userObject,

        accessToken,

        refreshToken
    };
};


// ======================================================
// VERIFY EMAIL
// ======================================================

const verifyEmail = async (token) => {

    // 1. Find user using verification token
    const user =
        await userRepository
            .findByVerificationToken(token);


    // 2. Token doesn't exist
    if (!user) {

        const error =
            new Error(
                "Invalid verification token"
            );

        error.statusCode = 400;

        throw error;
    }


    // 3. Check token expiration
    if (
        !user.emailVerificationExpires ||
        user.emailVerificationExpires < new Date()
    ) {

        const error =
            new Error(
                "Verification token expired"
            );

        error.statusCode = 400;

        throw error;
    }


    // 4. Verify email
    user.emailVerified = true;


    // 5. Delete token
    user.emailVerificationToken = undefined;

    user.emailVerificationExpires = undefined;


    // 6. Save user
    await user.save();


    // 7. Return user
    return user;
};


// ======================================================
// FORGOT PASSWORD
// ======================================================

const forgotPassword = async (email) => {

    const user =
        await userRepository.findByEmail(email);


    // Don't reveal whether email exists
    if (!user) {

        return {

            message:
                "If the email exists, a reset link has been sent."
        };
    }


    // Generate reset token
    const token =
        crypto
            .randomBytes(32)
            .toString("hex");


    user.passwordResetToken =
        token;

    user.passwordResetExpires =
        new Date(
            Date.now() +
            60 * 60 * 1000
        );


    await user.save();


    // Send email
    await sendResetPasswordEmail(user);


    return {

        message:
            "Password reset email sent."
    };
};


// ======================================================
// RESET PASSWORD
// ======================================================

const resetPassword = async (
    token,
    password
) => {

    const user =
        await userRepository
            .findByResetToken(token);


    if (!user) {

        const error =
            new Error(
                "Invalid reset token"
            );

        error.statusCode = 400;

        throw error;
    }


    if (
        !user.passwordResetExpires ||
        user.passwordResetExpires < new Date()
    ) {

        const error =
            new Error(
                "Reset token expired"
            );

        error.statusCode = 400;

        throw error;
    }


    // Hash new password
    const hashedPassword =
        await bcrypt.hash(
            password,
            10
        );


    user.password =
        hashedPassword;


    // Remove reset token
    user.passwordResetToken = null;

    user.passwordResetExpires = null;


    await user.save();


    return {

        message:
            "Password reset successfully"
    };
};


// ======================================================
// LOGOUT
// ======================================================
const logout = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    // Delete all refresh tokens for this user
    await refreshTokenService.removeUserTokens(userId);

    // Delete all sessions for this user
    await sessionRepository.deleteByUser(userId);

    return {
        message: "Logout successful"
    };
};

// ======================================================
// REFRESH TOKEN
// ======================================================

const refreshToken = async (token) => {

    // 1. Find token in database
    const storedToken =
        await refreshTokenService
            .findToken(token);

   

    if (!storedToken) {

        const error =
            new Error(
                "Invalid refresh token"
            );

        error.statusCode = 401;

        throw error;
    }


    // 2. Verify JWT
    jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET
    );


    // 3. Remove old token
    await refreshTokenService
        .removeToken(token);



    // 4. Generate new tokens
    const newAccessToken =
        generateAccessToken(
            storedToken.user
        );

    const newRefreshToken =
        generateRefreshToken(
            storedToken.user
        );


    // 5. New expiration
    const expiresAt =
        new Date(
            Date.now() +
            ms(process.env.REFRESH_TOKEN_EXPIRES_IN)
        );


    // 6. Save new refresh token
    await refreshTokenService.saveToken(
        storedToken.user,
        newRefreshToken,
        expiresAt
    );


    return {

        accessToken:
            newAccessToken,

        refreshToken:
            newRefreshToken
    };
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    register,

    login,

    verifyEmail,

    forgotPassword,

    resetPassword,

    logout,

    refreshToken
};