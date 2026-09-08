const service =
require("../services/commentService");



// Create Comment

// const createComment =
// async(req,res,next)=>{


// try{


// const comment =
// await service.addComment({

//     text:req.body.text,

//     user:req.user._id,

//    // post:req.body.postId
//      post: req.params.postId

// });



// res.status(201)
// .json({

// success:true,

// message:
// "Comment created",

// comment

// });



// }
// catch(error){

// next(error);

// }


// };


const Post = require("../models/Post");

const createComment = async (req, res, next) => {

    try {

        // Check whether the post exists
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Create the comment
        const comment = await service.addComment({

            text: req.body.text,

            user: req.user._id,

            post: req.params.postId

        });

        res.status(201).json({

            success: true,

            message: "Comment created",

            comment

        });

    } catch (error) {

        next(error);

    }

};


// Get Comments

const getComments =
async(req,res,next)=>{


try{


const comments =
await service.getComments(

req.params.postId

);



res.json({

success:true,

comments

});



}
catch(error){

next(error);

}


};





// Delete Comment

const deleteComment =
async(req,res,next)=>{


try{


await service.deleteComment(

req.params.id

);



res.json({

success:true,

message:
"Comment deleted"

});



}
catch(error){

next(error);

}


};



// Update Comment

const updateComment = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment text is required"
            });
        }

        const comment = await service.updateComment(
            req.params.id,
            text.trim(),
            req.user._id,
            req.user.role === "admin"
        );

        res.json({
            success: true,
            message: "Comment updated",
            comment
        });
    } catch (error) {
        if (error.statusCode === 403) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        next(error);
    }
};



module.exports={

createComment,

getComments,

deleteComment,
updateComment

};
