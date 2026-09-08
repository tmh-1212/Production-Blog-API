const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    token: {
        type: String,
        required: true,
        unique: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

device: String,
ipAddress: String,
userAgent: String,
revoked: Boolean

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "RefreshToken",
    refreshTokenSchema
);