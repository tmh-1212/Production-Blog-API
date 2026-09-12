const service =
require("../services/adminService");


// Get all users

const getUsers =
async(req,res,next)=>{


try{


const users =
await service.getAllUsers();



res.json({

success:true,

count:users.length,

users

});


}
catch(error){

next(error);

}

};




// Block user

const blockUser =
async(req,res,next)=>{


try{


const user =
await service.blockUser(
req.params.id
);



res.json({

success:true,

message:
"User blocked",

user

});


}
catch(error){

next(error);

}


};




// Unblock user

const unblockUser =
async(req,res,next)=>{


try{


const user =
await service.unblockUser(
req.params.id
);



res.json({

success:true,

message:
"User activated",

user

});


}
catch(error){

next(error);

}


};




// Delete user

const deleteUser =
async(req,res,next)=>{


try{


await service.removeUser(
req.params.id
);



res.json({

success:true,

message:
"User deleted"

});


}
catch(error){

next(error);

}

};



module.exports={

getUsers,

blockUser,

unblockUser,

deleteUser,

unblockUser

};
