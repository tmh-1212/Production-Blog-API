const Post = require("../models/Post");
const User = require("../models/User");


// Create post

const create =
async(data)=>{

    return await Post.create(data);

};



// Get all posts with pagination

const findAll = async (query = {}, page = 1, limit = 10) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [posts, totalPosts] = await Promise.all([
        Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum)
            .populate("author", "name email avatar"),
        Post.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalPosts / limitNum) || 0;

    return {
        posts,
        totalPosts,
        totalPages,
        page: pageNum,
        limit: limitNum
    };
};





// Find by id

const findById = async(id)=>{

     const post = await Post.findById(id);

     return post;
   

};

const findByIdWithAuthor = async(id)=>{

    return await Post.findById(id)
    .populate(
        "author",
        "name email avatar"
    );

};

const findBySlug = async (slug) => {
    return await Post.findOne({ slug }).populate("author", "name email avatar");
};

//Update

const update =
async(id,data)=>{


    return await Post.findByIdAndUpdate(

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


    return await Post.findByIdAndDelete(id);


};

// Like post (adds userId uniquely)

const likePost = async (id, userId) => {
    return await Post.findByIdAndUpdate(
        id,
        { $addToSet: { likes: userId } },
        { returnDocument: "after" }
    );
};

// Unlike post (removes userId)

const unlikePost = async (id, userId) => {
    return await Post.findByIdAndUpdate(
        id,
        { $pull: { likes: userId } },
        { returnDocument: "after" }
    );
};

// Increment view count atomically

const incrementViews = async (id) => {
    return await Post.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { returnDocument: "after" }
    );
};

// Bookmark a post (add postId to user's bookmarks, increment post.bookmarksCount)

const addBookmark = async (postId, userId) => {
    const [user, post] = await Promise.all([
        User.findByIdAndUpdate(
            userId,
            { $addToSet: { bookmarks: postId } },
            { returnDocument: "after" }
        ),
        Post.findByIdAndUpdate(
            postId,
            { $inc: { bookmarksCount: 1 } },
            { returnDocument: "after" }
        )
    ]);
    return { user, post };
};

// Unbookmark a post (remove postId from user's bookmarks, decrement post.bookmarksCount)

const removeBookmark = async (postId, userId) => {
    const [user, post] = await Promise.all([
        User.findByIdAndUpdate(
            userId,
            { $pull: { bookmarks: postId } },
            { returnDocument: "after" }
        ),
        Post.findByIdAndUpdate(
            postId,
            { $inc: { bookmarksCount: -1 } },
            { returnDocument: "after" }
        )
    ]);
    return { user, post };
};

// Get paginated bookmarked posts for a user

const getUserBookmarks = async (userId, page = 1, limit = 10) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const user = await User.findById(userId).select("bookmarks");
    if (!user || !user.bookmarks || user.bookmarks.length === 0) {
        return {
            bookmarks: [],
            totalBookmarks: 0,
            totalPages: 0,
            page: pageNum,
            limit: limitNum
        };
    }

    const totalBookmarks = user.bookmarks.length;
    const totalPages = Math.ceil(totalBookmarks / limitNum) || 0;

    const paginatedBookmarkIds = user.bookmarks.slice(skip, skip + limitNum);

    const posts = await Post.find({ _id: { $in: paginatedBookmarkIds } })
        .populate("author", "name email avatar");

    return {
        bookmarks: posts,
        totalBookmarks,
        totalPages,
        page: pageNum,
        limit: limitNum
    };
};


// Get trending posts (sorted by views or likes)
const findTrending = async (sortBy = "views", page = 1, limit = 10, category) => {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const filter = { status: "published" };
    if (category) {
        filter.category = category;
    }

    let posts, totalPosts;

    if (sortBy === "likes") {
        const pipeline = [
            { $match: filter },
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } }
                }
            },
            { $sort: { likesCount: -1, views: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limitNum },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    pipeline: [{ $project: { name: 1, email: 1, avatar: 1 } }],
                    as: "author"
                }
            },
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } }
        ];

        [posts, totalPosts] = await Promise.all([
            Post.aggregate(pipeline),
            Post.countDocuments(filter)
        ]);
    } else {
        [posts, totalPosts] = await Promise.all([
            Post.find(filter)
                .sort({ views: -1, createdAt: -1 })
                .skip(skip)
                .limit(limitNum)
                .populate("author", "name email avatar"),
            Post.countDocuments(filter)
        ]);
    }

    const totalPages = Math.ceil(totalPosts / limitNum) || 0;

    return {
        posts,
        totalPosts,
        totalPages,
        page: pageNum,
        limit: limitNum,
        sortBy: sortBy === "likes" ? "likes" : "views"
    };
};

// Aggregate tags across published posts
const getAggregatedTags = async () => {
    return await Post.aggregate([
        { $match: { status: "published", tags: { $exists: true, $ne: [] } } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
        {
            $project: {
                _id: 0,
                name: "$_id",
                count: 1
            }
        }
    ]);
};

module.exports = {
    create,
    findAll,
    findById,
    findByIdWithAuthor,
    findBySlug,
    update,
    remove,
    likePost,
    unlikePost,
    incrementViews,
    addBookmark,
    removeBookmark,
    getUserBookmarks,
    findTrending,
    getAggregatedTags
};

