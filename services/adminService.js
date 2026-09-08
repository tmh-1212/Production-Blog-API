const repository =
require("../repositories/adminRepository");



const getAllUsers =
async()=>{


    return await repository.getUsers();


};





const blockUser =
async(id)=>{


    return await repository.updateUser(

        id,

        {
            status:"blocked"
        }

    );


};





const unblockUser =
async(id)=>{


    return await repository.updateUser(

        id,

        {
            status:"active"
        }

    );


};





const removeUser =
async(id)=>{


    return await repository.deleteUser(id);


};



module.exports={

getAllUsers,

blockUser,

unblockUser,

removeUser

};
