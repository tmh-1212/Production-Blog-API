const repository =
require("../repositories/adminRepository");



const getAllUsers =
async()=>{


    return await repository.getUsers();


};





const blockUser = async (id) => {
    const user = await repository.updateUser(id, {
        status: "blocked"
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};



const unblockUser = async (id) => {
    const user = await repository.updateUser(id, {
        status: "active"
    });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};


const removeUser = async (id) => {
    const user = await repository.deleteUser(id);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};



module.exports={

getAllUsers,

blockUser,

unblockUser,

removeUser

};
