const repository = require("../repositories/refreshTokenRepository");

const saveToken = async (userId, token, expiresAt) => {
    return await repository.create({
        user: userId,
        token,
        expiresAt
    });
};

const findToken = async (token) => {
    return await repository.findByToken(token);
};

const removeToken = async (token) => {
    return await repository.deleteByToken(token);
};

const removeUserTokens = async (userId) => {
    return await repository.deleteByUser(userId);
};

module.exports = {
    saveToken,
    findToken,
    removeToken,
    removeUserTokens
};