const Session = require("../models/Session");

const getUserSessions = async (userId) => {
    return await Session.find({ user: userId })
        .sort({ createdAt: -1 });
};

const deleteSession = async (userId, sessionId) => {
    return await Session.findOneAndDelete({
        _id: sessionId,
        user: userId
    });
};

const deleteAllSessions = async (userId) => {
    return await Session.deleteMany({
        user: userId
    });
};

module.exports = {
    getUserSessions,
    deleteSession,
    deleteAllSessions
};