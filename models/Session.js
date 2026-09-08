const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    refreshToken: {
        type: String,
        required: true,
        unique: true
    },

    ipAddress: {
        type: String
    },

    userAgent: {
        type: String
    },

    device: {
        type: String
    },

    browser: {
        type: String
    },

    os: {
        type: String
    },

    current: {
        type: Boolean,
        default: false
    },

    lastActivity: {
        type: Date,
        default: Date.now
    },

    expiresAt: {
        type: Date,
        required: true
    }

}, {
    timestamps: true
});


sessionSchema.index({ user: 1 });

sessionSchema.index({ expiresAt: 1 });

sessionSchema.index({ token: 1 });


sessionSchema.index(
  { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("Session", sessionSchema);