const RefreshToken = require("../models/RefreshToken");

const create = async (data) => {
    return await RefreshToken.create(data);
};

const findByToken = async (token) => {
    return await RefreshToken.findOne({ token });
};

const deleteByToken = async (token) => {
    return await RefreshToken.findOneAndDelete({ token });
};

const deleteByUser = async (userId) => {
    return await RefreshToken.deleteMany({
        user: userId
    });
};

module.exports = {
    create,
    findByToken,
    deleteByToken,
    deleteByUser
};