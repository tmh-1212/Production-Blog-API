// const service =
// require("../services/postService");



// // Create

// const createPost =
// async(req,res,next)=>{


// try{


// const data={

//     title:req.body.title,

//     description:req.body.description,

//     category:req.body.category,

//     status: req.body.status || "published",

//     tags: req.body.tags,

//     author:req.user._id

// };



// if(req.file){

//     data.image =
//     req.file.path;

// }



// const post =
// await service.createPost(data);



// res.status(201)
// .json({

// success:true,

// message:
// "Post created",

// post

// });



// }catch(error){

// next(error);

// }

// };




// // Get all posts (with real pagination)

// const getPosts = async (req, res, next) => {
//     try {
//         const { search, category, tags, status, page = 1, limit = 10 } = req.query;

//         const pageNum = Math.max(1, parseInt(page, 10) || 1);
//         const limitNum = Math.max(1, parseInt(limit, 10) || 10);

//         let query = {};

//         if (search) {
//             query.title = {
//                 $regex: search,
//                 $options: "i"
//             };
//         }

//         if (category) {
//             query.category = category;
//         }

//         if (tags) {
//             const tagList = tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
//             if (tagList.length > 0) {
//                 query.tags = { $in: tagList };
//             }
//         }

//         // Default to only published posts for the public listing;
//         // allow explicit override via ?status= query parameter
//         query.status = status || "published";

//         const result = await service.getPosts(query, pageNum, limitNum);

//         res.json({
//             success: true,
//             pagination: {
//                 totalPosts: result.totalPosts,
//                 totalPages: result.totalPages,
//                 page: result.page,
//                 limit: result.limit
//             },
//             posts: result.posts
//         });
//     } catch (error) {
//         next(error);
//     }
// };





// // Get single by ID

// const getPost = async (req, res, next) => {
//     try {
//         const post = await service.getPost(req.params.id);

//         res.json({
//             success: true,
//             post
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Get single by Slug

// const getPostBySlug = async (req, res, next) => {
//     try {
//         const post = await service.getPostBySlug(req.params.slug);

//         res.json({
//             success: true,
//             post
//         });
//     } catch (error) {
//         next(error);
//     }
// };





// // Update




// const updatePost =
// async(req,res,next)=>{

// try{


// const post =
// await service.getPost(
// req.params.id
// );


// if(!post){

// return res.status(404).json({

// success:false,

// message:"Post not found"

// });

// }



// if(
// post.author.toString()
// !== req.user._id.toString()
// &&
// req.user.role !== "admin"
// ){

// return res.status(403).json({

// success:false,

// message:"You cannot update this post"

// });

// }



// const updatedPost =
// await service.updatePost(

//     req.params.id,

//     {
//         ...req.body,
//         ...(req.file ? { image: req.file.path } : {})
//     }

// );



// res.json({

// success:true,

// post:updatedPost

// });


// }catch(error){

// next(error);

// }

// };



// // Delete

// const deletePost = async (req, res, next) => {
//     try {

//         // 1. Find the post
//         const post = await service.getPost(req.params.id);

//         if (!post) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Post not found"
//             });
//         }

//         // 2. Check authorization
//         const isOwner =
//             post.author.toString() ===
//             req.user._id.toString();

//         const isAdmin =
//             req.user.role === "admin";

//         // 3. Reject unauthorized user
//         if (!isOwner && !isAdmin) {
//             return res.status(403).json({
//                 success: false,
//                 message: "You cannot delete this post"
//             });
//         }

//         // 4. Delete post
//         await service.deletePost(req.params.id);

//         // 5. Success response
//         res.status(200).json({
//             success: true,
//             message: "Post deleted successfully"
//         });

//     } catch (error) {
//         next(error);
//     }
// };


// // Like post

// const likePost = async (req, res, next) => {
//     try {
//         const post = await service.likePost(req.params.id, req.user._id);

//         res.json({
//             success: true,
//             message: "Post liked",
//             likes: post.likes ? post.likes.length : 0
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Unlike Post

// const unlikePost = async (req, res, next) => {
//     try {
//         const post = await service.unlikePost(req.params.id, req.user._id);

//         res.json({
//             success: true,
//             message: "Post unliked",
//             likes: post.likes ? post.likes.length : 0
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Get Likes Count

// const getLikes = async (req, res, next) => {
//     try {
//         const post = await service.getLikes(req.params.id);

//         res.json({
//             success: true,
//             likes: post.likes ? post.likes.length : 0,
//             likedBy: post.likes || []
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Bookmark Post

// const bookmarkPost = async (req, res, next) => {
//     try {
//         await service.addBookmark(req.params.id, req.user._id);

//         res.json({
//             success: true,
//             message: "Post bookmarked"
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Unbookmark Post

// const unbookmarkPost = async (req, res, next) => {
//     try {
//         await service.removeBookmark(req.params.id, req.user._id);

//         res.json({
//             success: true,
//             message: "Post removed from bookmarks"
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Get My Bookmarks (with pagination)

// const getMyBookmarks = async (req, res, next) => {
//     try {
//         const { page = 1, limit = 10 } = req.query;
//         const result = await service.getUserBookmarks(req.user._id, page, limit);

//         res.json({
//             success: true,
//             pagination: {
//                 totalBookmarks: result.totalBookmarks,
//                 totalPages: result.totalPages,
//                 page: result.page,
//                 limit: result.limit
//             },
//             bookmarks: result.bookmarks
//         });
//     } catch (error) {
//         next(error);
//     }
// };


// // Get Trending Posts

// const getTrendingPosts = async (req, res, next) => {
//     try {
//         const { sortBy = "views", page = 1, limit = 10, category } = req.query;
//         const result = await service.getTrendingPosts(sortBy, page, limit, category);

//         res.json({
//             success: true,
//             pagination: {
//                 totalPosts: result.totalPosts,
//                 totalPages: result.totalPages,
//                 page: result.page,
//                 limit: result.limit,
//                 sortBy: result.sortBy
//             },
//             posts: result.posts
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// module.exports={

// createPost,

// getPosts,

// getPost,

// getPostBySlug,

// updatePost,

// deletePost,
// likePost,
// unlikePost,
// getLikes,
// bookmarkPost,
// unbookmarkPost,
// getMyBookmarks,
// getTrendingPosts
// };

  




//change this code where to develop frontend

const service = require("../services/postService");

// =====================================================
// CREATE POST
// =====================================================

const createPost = async (req, res, next) => {
    try {

        const data = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            status: req.body.status || "published",
            tags: req.body.tags,

            // Author comes from authenticated user
            author: req.user._id
        };

        // If image uploaded
        if (req.file) {
            data.image = req.file.path;
        }

        const post =
            await service.createPost(data);

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// GET ALL POSTS
// =====================================================

const getPosts = async (req, res, next) => {
    try {

        const {
            search,
            category,
            tags,
            status,
            page = 1,
            limit = 10
        } = req.query;

        const pageNum =
            Math.max(
                1,
                parseInt(page, 10) || 1
            );

        const limitNum =
            Math.max(
                1,
                parseInt(limit, 10) || 10
            );

        let query = {};

        // Search by title
        if (search) {
            query.title = {
                $regex: search,
                $options: "i"
            };
        }

        // Category
        if (category) {
            query.category = category;
        }

        // Tags
        if (tags) {

            const tagList = tags
                .split(",")
                .map((tag) =>
                    tag.trim().toLowerCase()
                )
                .filter(Boolean);

            if (tagList.length > 0) {
                query.tags = {
                    $in: tagList
                };
            }
        }

        // Default status
        query.status =
            status || "published";

        const result =
            await service.getPosts(
                query,
                pageNum,
                limitNum
            );

        res.json({
            success: true,

            pagination: {
                totalPosts:
                    result.totalPosts,

                totalPages:
                    result.totalPages,

                page:
                    result.page,

                limit:
                    result.limit
            },

            posts:
                result.posts
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// GET SINGLE POST
// =====================================================

const getPost = async (req, res, next) => {
    try {

        const post =
            await service.getPost(
                req.params.id
            );

        res.json({
            success: true,
            post
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// GET POST BY SLUG
// =====================================================

const getPostBySlug = async (
    req,
    res,
    next
) => {
    try {

        const post =
            await service.getPostBySlug(
                req.params.slug
            );

        res.json({
            success: true,
            post
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// UPDATE POST
// OWNER OR ADMIN ONLY
// =====================================================

const updatePost = async (req, res, next) => {
    try {

        // IMPORTANT:
        // Don't use getPost() here because
        // getPost() increments views.

        const post =
            await service.getPostForAuthorization(
                req.params.id
            );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check owner
        const isOwner =
            post.author.toString() ===
            req.user._id.toString();

        // Check admin
        const isAdmin =
            req.user.role === "admin";

        // Owner OR Admin
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot update this post"
            });
        }

        // Prepare update data
        const updateData = {
            ...req.body
        };

        // If new image uploaded
        if (req.file) {
            updateData.image =
                req.file.path;
        }

        const updatedPost =
            await service.updatePost(
                req.params.id,
                updateData
            );

        res.status(200).json({
            success: true,
            message:
                "Post updated successfully",
            post: updatedPost
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// DELETE POST
// OWNER OR ADMIN ONLY
// =====================================================

const deletePost = async (req, res, next) => {
    try {

        // Get post without increasing views
        const post =
            await service.getPostForAuthorization(
                req.params.id
            );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check whether current user is owner
        const isOwner =
            post.author.toString() ===
            req.user._id.toString();

        // Check whether current user is admin
        const isAdmin =
            req.user.role === "admin";

        // Only owner OR admin can delete
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message:
                    "You cannot delete this post"
            });
        }

        // Delete post
        await service.deletePost(
            req.params.id
        );

        res.status(200).json({
            success: true,
            message:
                "Post deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// LIKE POST
// =====================================================

const likePost = async (
    req,
    res,
    next
) => {
    try {

        const post =
            await service.likePost(
                req.params.id,
                req.user._id
            );

        res.json({
            success: true,
            message: "Post liked",

            likes:
                post.likes
                    ? post.likes.length
                    : 0
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// UNLIKE POST
// =====================================================

const unlikePost = async (
    req,
    res,
    next
) => {
    try {

        const post =
            await service.unlikePost(
                req.params.id,
                req.user._id
            );

        res.json({
            success: true,
            message: "Post unliked",

            likes:
                post.likes
                    ? post.likes.length
                    : 0
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// GET LIKES
// =====================================================

const getLikes = async (
    req,
    res,
    next
) => {
    try {

        const post =
            await service.getLikes(
                req.params.id
            );

        res.json({
            success: true,

            likes:
                post.likes
                    ? post.likes.length
                    : 0,

            likedBy:
                post.likes || []
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// BOOKMARK
// =====================================================

const bookmarkPost = async (
    req,
    res,
    next
) => {
    try {

        await service.addBookmark(
            req.params.id,
            req.user._id
        );

        res.json({
            success: true,
            message:
                "Post bookmarked"
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// UNBOOKMARK
// =====================================================

const unbookmarkPost = async (
    req,
    res,
    next
) => {
    try {

        await service.removeBookmark(
            req.params.id,
            req.user._id
        );

        res.json({
            success: true,
            message:
                "Post removed from bookmarks"
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// GET MY BOOKMARKS
// =====================================================

const getMyBookmarks = async (
    req,
    res,
    next
) => {
    try {

        const {
            page = 1,
            limit = 10
        } = req.query;

        const result =
            await service.getUserBookmarks(
                req.user._id,
                page,
                limit
            );

        res.json({
            success: true,

            pagination: {
                totalBookmarks:
                    result.totalBookmarks,

                totalPages:
                    result.totalPages,

                page:
                    result.page,

                limit:
                    result.limit
            },

            bookmarks:
                result.bookmarks
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// TRENDING POSTS
// =====================================================

const getTrendingPosts = async (
    req,
    res,
    next
) => {
    try {

        const {
            sortBy = "views",
            page = 1,
            limit = 10,
            category
        } = req.query;

        const result =
            await service.getTrendingPosts(
                sortBy,
                page,
                limit,
                category
            );

        res.json({
            success: true,

            pagination: {
                totalPosts:
                    result.totalPosts,

                totalPages:
                    result.totalPages,

                page:
                    result.page,

                limit:
                    result.limit,

                sortBy:
                    result.sortBy
            },

            posts:
                result.posts
        });

    } catch (error) {
        next(error);
    }
};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {

    createPost,

    getPosts,

    getPost,

    getPostBySlug,

    updatePost,

    deletePost,

    likePost,

    unlikePost,

    getLikes,

    bookmarkPost,

    unbookmarkPost,

    getMyBookmarks,

    getTrendingPosts
};