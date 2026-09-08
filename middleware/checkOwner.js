const Comment =
require("../models/Comment");


const checkCommentOwner =
async(req,res,next)=>{


const comment =
await Comment.findById(
req.params.id
);



if(!comment){

return res.status(404)
.json({

message:"Comment not found"

});

}



if(
comment.user.toString()
!==
req.user._id.toString()
){

return res.status(403)
.json({

message:
"Not allowed"

});

}



next();


};



module.exports =
checkCommentOwner;
