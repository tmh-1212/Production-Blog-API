const sessionRepository = require("../repositories/sessionRepository");

const getUserSessions = async (userId) => {
    return await sessionRepository.findByUser(userId);
};

const deleteSession = async (userId, sessionId) => {
    const session = await sessionRepository.deleteByUserAndId(
        userId,
        sessionId
    );

    if (!session) {
        const error = new Error("Session not found");
        error.statusCode = 404;
        throw error;
    }

    return session;
};

const deleteAllSessions = async (userId) => {
    return await sessionRepository.deleteByUser(userId);
};

module.exports = {
    getUserSessions,
    deleteSession,
    deleteAllSessions
};
