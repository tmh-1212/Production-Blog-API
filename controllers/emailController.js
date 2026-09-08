const User =
require("../models/User");



const verifyEmail =
async(req,res,next)=>{


try{


const user =
await User.findOne({

emailVerificationToken:
req.params.token

});



if(!user){

return res.status(400)
.json({

success:false,

message:
"Invalid verification token"

});

}



if(
user.emailVerificationExpires < Date.now()
){

return res.status(400)
.json({

success:false,

message:
"Token expired"

});

}



user.emailVerified=true;

user.emailVerificationToken=undefined;

user.emailVerificationExpires=undefined;


await user.save();



res.json({

success:true,

message:
"Email verified successfully"

});


}catch(error){

next(error);

}


};



module.exports={
verifyEmail
};