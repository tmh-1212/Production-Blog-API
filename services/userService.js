const userRepository =
require("../repositories/userRepository");

const User = require("../models/User");

const getProfile =
async(userId)=>{


    const user =
    await userRepository
    .findById(userId);



    if(!user){

        throw new Error(
            "User not found"
        );

    }


    return user;


};




const updateProfile =
async(userId,data)=>{


    return await userRepository
    .update(
        userId,
        data
    );


};

const changePassword =
async(
userId,
currentPassword,
newPassword
)=>{


const user =
await User.findById(userId)
.select("+password");


if(!user){

throw new Error(
"User not found"
);

}



// check old password

const isMatch =
await user.comparePassword(
    currentPassword
);



if(!isMatch){

const error =
new Error(
"Current password is incorrect"
);

error.statusCode=400;

throw error;

}



// update password

user.password =
newPassword;


await user.save();


return user;


};

module.exports={

    getProfile,

    updateProfile,
    changePassword

};