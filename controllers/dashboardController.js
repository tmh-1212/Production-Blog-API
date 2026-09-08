const User =
require("../models/User");

const Post =
require("../models/Post");

const Comment =
require("../models/Comment");



const statistics =
async(req,res)=>{


const users =
await User.countDocuments();



const posts =
await Post.countDocuments();



const comments =
await Comment.countDocuments();



res.json({

success:true,

statistics:{

users,

posts,

comments

}

});


};



module.exports={
statistics
};
