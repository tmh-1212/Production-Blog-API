const sessionService = require("../services/sessionService");

const getSessions = async (req, res, next) => {
    try {
        const sessions = await sessionService.getUserSessions(req.user._id);

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    } catch (error) {
        next(error);
    }
};

const deleteSession = async (req, res, next) => {
    try {
        await sessionService.deleteSession(
            req.user._id,
            req.params.id
        );

        res.status(200).json({
            success: true,
            message: "Session removed successfully"
        });
    } catch (error) {
        next(error);
    }
};

const deleteAllSessions = async (req, res, next) => {
    try {
        await sessionService.deleteAllSessions(req.user._id);

        res.status(200).json({
            success: true,
            message: "All sessions removed successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSessions,
    deleteSession,
    deleteAllSessions
};