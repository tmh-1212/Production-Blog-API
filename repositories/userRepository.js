const User = require("../models/User");

// Find user by email
const findByEmail = async (email) => {
    return await User.findOne({ email }).select("+password");
};

// Find user by ID
const findById = async (id) => {
    return await User.findById(id);
};

// Create user
const create = async (data) => {
    return await User.create(data);
};

// Update user
const update = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true,
    });
};

const findByVerificationToken =
async(token)=>{

    return await User.findOne({

        emailVerificationToken:token

    });

};

const findByResetToken = async (token) => {

    return User.findOne({

        passwordResetToken: token

    });

};
module.exports = {
    findByEmail,
    findById,
    create,
    update,
    findByVerificationToken,
    findByResetToken
};
