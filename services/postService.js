const repository = require("../repositories/postRepository");

// Generate slug
const generateSlug = (title) => {
    if (!title) {
        return `post-${Date.now()}`;
    }

    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        + "-" +
        Math.random().toString(36).substring(2, 7);
};

// Calculate reading time
const calculateReadingTime = (text) => {
    if (!text) {
        return 1;
    }

    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;

    return Math.max(
        1,
        Math.ceil(words / wordsPerMinute)
    );
};

// ===============================
// CREATE POST
// ===============================

const createPost = async (data) => {

    if (data.title && !data.slug) {
        data.slug = generateSlug(data.title);
    }

    if (data.description) {
        data.readingTime =
            calculateReadingTime(data.description);
    }

    // Normalize tags
    if (
        data.tags &&
        typeof data.tags === "string"
    ) {
        data.tags = data.tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);
    }

    return await repository.create(data);
};

// ===============================
// GET POSTS
// ===============================

const getPosts = async (
    query = {},
    page = 1,
    limit = 10
) => {
    return await repository.findAll(
        query,
        page,
        limit
    );
};

// ===============================
// GET SINGLE POST
// ===============================

const getPost = async (id) => {

    const post =
        await repository.findById(id);

   if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}

    // Increment views without blocking response
    repository.incrementViews(id).catch(() => {});

    return post;
};

// ===============================
// GET POST FOR AUTHORIZATION
// ===============================

const getPostForAuthorization = async (id) => {

    const post =
        await repository.findById(id);

    if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}

    return post;
};

// ===============================
// GET POST BY SLUG
// ===============================

const getPostBySlug = async (slug) => {

    const post =
        await repository.findBySlug(slug);

   if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}

    repository
        .incrementViews(post._id)
        .catch(() => {});

    return post;
};

// ===============================
// GET POST WITH AUTHOR
// ===============================

const getPostWithAuthor = async (id) => {

    const post =
        await repository.findByIdWithAuthor(id);

    if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}

    return post;
};

// ===============================
// UPDATE POST
// ===============================

const updatePost = async (id, data) => {

    if (data.title) {
        data.slug =
            generateSlug(data.title);
    }

    if (data.description) {
        data.readingTime =
            calculateReadingTime(
                data.description
            );
    }

    // Normalize tags
    if (
        data.tags &&
        typeof data.tags === "string"
    ) {
        data.tags = data.tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);
    }

   const post = await repository.update(
    id,
    data
);

if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}

return post;
};
// ===============================
// DELETE POST
// ===============================

const deletePost = async (id) => {

    const post = await repository.remove(id);

    if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
    }

    return post;
};

// ===============================
// LIKE POST
// ===============================

const likePost = async (id, userId) => {

    const post =
        await repository.likePost(
            id,
            userId
        );

    if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}
    return post;
};

// ===============================
// UNLIKE POST
// ===============================

const unlikePost = async (id, userId) => {

    const post =
        await repository.unlikePost(
            id,
            userId
        );

   if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}

    return post;
};

// ===============================
// GET LIKES
// ===============================

const getLikes = async (id) => {

    const post =
        await repository.findById(id);
if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}

    return post;
};

// ===============================
// ADD BOOKMARK
// ===============================

const addBookmark = async (
    postId,
    userId
) => {

    const post =
        await repository.findById(postId);

   if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}

    return await repository.addBookmark(
        postId,
        userId
    );
};

// ===============================
// REMOVE BOOKMARK
// ===============================

const removeBookmark = async (
    postId,
    userId
) => {

    const post =
        await repository.findById(postId);

    if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
}

    return await repository.removeBookmark(
        postId,
        userId
    );
};

// ===============================
// GET USER BOOKMARKS
// ===============================

const getUserBookmarks = async (
    userId,
    page = 1,
    limit = 10
) => {

    return await repository.getUserBookmarks(
        userId,
        page,
        limit
    );
};

// ===============================
// GET TRENDING POSTS
// ===============================

const getTrendingPosts = async (
    sortBy = "views",
    page = 1,
    limit = 10,
    category
) => {

    return await repository.findTrending(
        sortBy,
        page,
        limit,
        category
    );
};

// ===============================
// EXPORT
// ===============================

module.exports = {

    createPost,

    getPosts,

    getPost,

    getPostForAuthorization,

    getPostBySlug,

    getPostWithAuthor,

    updatePost,

    deletePost,

    likePost,

    unlikePost,

    getLikes,

    addBookmark,

    removeBookmark,

    getUserBookmarks,

    getTrendingPosts
};