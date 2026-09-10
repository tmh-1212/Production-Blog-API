const Session = require("../models/Session");
const logger = require("../utils/logger");

const updateActivity = async (req, res, next) => {
    try {

        const refreshToken = req.body.refreshToken;

        if (refreshToken) {

            await Session.findOneAndUpdate(
                {
                    refreshToken
                },
                {
                    lastActivity: new Date()
                }
            );

        }

        next();

    } catch (error) {

        logger.error(error);

        next();

    }
};

module.exports = updateActivity;