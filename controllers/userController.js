// const userService =
// require("../services/userService");



// // GET PROFILE

// const getProfile =
// async(req,res,next)=>{


//     try{


//         const user =
//         await userService
//         .getProfile(
//             req.user._id
//         );


//         res.json({

//             success:true,

//             user

//         });


//     }
//     catch(error){

//         next(error);

//     }


// };





// // UPDATE PROFILE

// const updateProfile =
// async(req,res,next)=>{


//     try{


//         const data = {


//             name:req.body.name,

//             bio:req.body.bio,

//             phone:req.body.phone


//         };



//         if(req.file){

//             data.avatar =
//             req.file.path;

//         }



//         const user =
//         await userService
//         .updateProfile(

//             req.user._id,

//             data

//         );



//         res.json({

//             success:true,

//             message:
//             "Profile updated successfully",

//             user

//         });


//     }
//     catch(error){

//         next(error);

//     }


// };



// module.exports={

//     getProfile,

//     updateProfile

// };



// //practice for each part
//       // part 3:
//    const getProfile =
// async(req,res)=>{


//     res.json({

//         success:true,

//         user:req.user

//     });


// };


// module.exports={

//     getProfile

// };




     //part 4:
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



const updateProfile = async (req, res) => {

    // const updateData = {

    //     name: req.body.name,

    //     bio: req.body.bio,
    //     email: req.body.email,
    //     phone: req.body.phone
    // };

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

return res.status(400).json({
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

    res.status(500).json({

        success:false,

        message:error.message

    });
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