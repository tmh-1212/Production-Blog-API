const Session = require("../models/Session");

const create = async (sessionData) => {
    return await Session.create(sessionData);
};

const findByUser = async (userId) => {
    return await Session.find({ user: userId })
        .sort({ createdAt: -1 });
};

const findById = async (id) => {
    return await Session.findById(id);
};

const findByRefreshToken = async (refreshToken) => {
    return await Session.findOne({
        refreshToken
    });
};

const updateLastActivity = async (id) => {
    return await Session.findByIdAndUpdate(
        id,
        {
            lastActivity: new Date()
        },
        {
            new: true
        }
    );
};

const deleteById = async (id) => {
    return await Session.findByIdAndDelete(id);
};

const deleteByUser = async (userId) => {
    return await Session.deleteMany({
        user: userId
    });
};

const deleteByRefreshToken = async (refreshToken) => {
    return await Session.findOneAndDelete({
        refreshToken
    });
};

module.exports = {
    create,
    findByUser,
    findById,
    findByRefreshToken,
    updateLastActivity,
    deleteById,
    deleteByUser,
    deleteByRefreshToken
};