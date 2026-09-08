const authService =
require("../services/authService");

const logger =
require("../utils/logger");

// Register Controller

const register =
async(req,res,next)=>{


    try{


        const result =
        await authService.register(
            req.body
        );



        res.status(201)
        .json({

            success:true,

            message:
            "User registered successfully",

            data:result

        });



    }catch(error){


logger.error(
error.message
);


next(error);


}



};




// Login Controller

const login =
async(req,res,next)=>{


    try{


        const {
            email,
            password
        } = req.body;



        const result =
        await authService.login(
            email,
            password
        );



        res.json({

            success:true,

            message:
            "Login successful",

            data:result

        });



    }catch(error){

        next(error);

    }


};
const verifyEmail =
async(req,res,next)=>{

try{


const user =
await authService.verifyEmail(
    req.params.token
);



res.json({

success:true,

message:
"Email verified successfully",

user

});


}catch(error){

next(error);

}


};

const forgotPassword = async (req, res, next) => {

    try {

        const result =
            await authService.forgotPassword(req.body.email);

        res.status(200).json({

            success: true,

            ...result

        });

    } catch (error) {

        next(error);

    }

};

const resetPassword = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await authService.resetPassword(

                req.params.token,

                req.body.password

            );

        res.status(200).json({

            success: true,

            ...result

        });

    } catch (error) {

        next(error);

    }

};

const logout = async (req, res, next) => {
  try {

    await authService.logout(req.user.id);

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (err) {
    next(err);
  }
};

const refreshToken = async(req,res,next)=>{

    try{

        const result =
        await authService.refreshToken(
            req.body.refreshToken
        );


        res.status(200).json({

            success:true,

            data:result

        });


    }catch(error){

        next(error);

    }

};
module.exports={

    register,

    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    refreshToken

};