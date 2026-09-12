const Session = require("../models/Session");

const getUserSessions = async (userId) => {
    return await Session.find({ user: userId })
        .sort({ createdAt: -1 });
};

const deleteSession = async (userId, sessionId) => {
    const session = await Session.findOneAndDelete({
        _id: sessionId,
        user: userId
    });

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    return session;
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