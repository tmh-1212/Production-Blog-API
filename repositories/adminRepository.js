const User =
require("../models/User");


const getUsers =
async()=>{


    return await User.find()
    .select("-password");


};



const findUser =
async(id)=>{


    return await User.findById(id);


};




const updateUser =
async(id,data)=>{


    return await User.findByIdAndUpdate(

        id,

        data,

        {
            new:true
        }

    )
    .select("-password");


};




const deleteUser =
async(id)=>{


    return await User.findByIdAndDelete(id);


};




module.exports={

getUsers,

findUser,

updateUser,

deleteUser

};
