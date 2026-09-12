const repository = require("../repositories/commentRepository");
const Post = require("../models/Post");



// Add comment and sync commentsCount on the post

const addComment = async (data) => {
    const comment = await repository.create(data);

    // Atomically increment commentsCount on the parent post
    await Post.findByIdAndUpdate(
        data.post,
        { $inc: { commentsCount: 1 } }
    );

    return comment;
};





// Get comments

const getComments =
async(postId)=>{


    return await repository
    .findByPost(postId);


};





// Delete comment and decrement commentsCount on the post

const deleteComment = async (id) => {
    const comment = await repository.findById(id);

    if (!comment) {
        const error = new Error("Comment not found");
        error.statusCode = 404;
        throw error;
    }

    const deleted = await repository.remove(id);
    // Decrement commentsCount (never below 0)
    if (comment) {
        await Post.findByIdAndUpdate(
            comment.post,
            { $inc: { commentsCount: -1 } }
        );
    }

    return deleted;
};

// Update comment (ownership enforced at controller level)

const updateComment = async (id, text, requesterId, isAdmin = false) => {
    const comment = await repository.findById(id);

    if (!comment) {
    const error = new Error("Comment not found");
    error.statusCode = 404;
    throw error;
}

    if (
        comment.user.toString() !== requesterId.toString() &&
        !isAdmin
    ) {
        const err = new Error("You cannot edit this comment");
        err.statusCode = 403;
        throw err;
    }

    return await repository.update(id, { text });
};

module.exports = {
    addComment,
    getComments,
    deleteComment,
    updateComment
};
