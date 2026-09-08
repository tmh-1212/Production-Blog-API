const Comment =
require("../models/Comment");


// Create comment

const create =
async(data)=>{

    return await Comment.create(data);

};



// Get comments

const findByPost =
async(postId)=>{


    return await Comment.find({

        post:postId

    })

    .populate(
        "user",
        "name avatar"
    );


};



// Find comment

const findById =
async(id)=>{


    return await Comment.findById(id);


};



// Update comment

const update = async (id, data) => {
    return await Comment.findByIdAndUpdate(
        id,
        data,
        {
            returnDocument: "after",
            runValidators: true
        }
    );
};



// Delete

const remove =
async(id)=>{


    return await Comment.findByIdAndDelete(id);


};



module.exports={

create,

findByPost,

findById,

update,

remove

};
