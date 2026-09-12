const userService =
require("../services/userService");

const userRepository =
require("../repositories/userRepository");


// GET PROFILE

const getProfile =
async(req,res,next)=>{


    try{


        const user =
        await userService
        .getProfile(
            req.user._id
        );


        res.json({

            success:true,

            user

        });


    }
    catch(error){

        next(error);

    }


};



const updateProfile = async (req, res, next) => {
    try {


const {
    name,
    email,
    bio,
    phone
}=req.body;



const updateData = {

    name,
    email,
    bio,
    phone

};

    // check email exists

if(email){

const existingUser =
await userRepository.findByEmail(email);


if(
existingUser &&
existingUser._id.toString() !== req.user.id
){

return res.status(409).json({
    success:false,
    message:"Email already in use"
});

}

}

    if (req.file) {

        updateData.avatar =
            "/uploads/avatars/" + req.file.filename;

    }

    const user =
        await userService.updateProfile(

            req.user._id,

            updateData

        );

    res.json({

        success: true,

        user

    });
   
}

   catch(error){

    next(error);

}

};

const changePassword =
async(req,res,next)=>{


try{


const {
    currentPassword,
    newPassword
}=req.body;



const user =
await userService.changePassword(

    req.user._id,

    currentPassword,

    newPassword

);



res.json({

    success:true,

    message:"Password updated successfully"

});


}
catch(error){

    next(error);

}


};

module.exports = {

    getProfile,
    updateProfile,
     changePassword

};