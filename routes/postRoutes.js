const express =
require("express");


const router =
express.Router();


const protect =
require("../middleware/authMiddleware");


const upload =
require("../middleware/uploadMiddleware");


const controller =
require("../controllers/postController");



// Create
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Image Blog
 *               description:
 *                 type: string
 *                 example: Testing Multer Upload
 *               category:
 *                 type: string
 *                 example: Technology
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */

router.post(

"/",

protect,

upload.single("image"),

controller.createPost

);



// Get all

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts with pagination, search, and category filter
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for title
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter posts by category
 *     responses:
 *       200:
 *         description: List of posts with pagination metadata
 */

router.get(

"/",

controller.getPosts

);

// Get trending posts
/**
 * @swagger
 * /api/posts/trending:
 *   get:
 *     summary: Get trending posts sorted by views or likes
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [views, likes]
 *           default: views
 *         description: Sort trending posts by views or likes
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of trending posts sorted by views or likes count
 */
router.get(
    "/trending",
    controller.getTrendingPosts
);

// Get by slug
/**
 * @swagger
 * /api/posts/slug/{slug}:
 *   get:
 *     summary: Get a single post by URL slug
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */
router.get(
    "/slug/:slug",
    controller.getPostBySlug
);


// Get my bookmarks (must be before /:id to avoid Express matching "bookmarks" as an id)
/**
 * @swagger
 * /api/posts/bookmarks:
 *   get:
 *     summary: Get the authenticated user's bookmarked posts with pagination
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated bookmarked posts
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/bookmarks",
    protect,
    controller.getMyBookmarks
);


// Get one

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get a single post
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post found
 *       404:
 *         description: Post not found
 */
router.get(

"/:id",

controller.getPost

);



// Update

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Post updated
 */

router.put(

"/:id",

protect,

upload.single("image"),

controller.updatePost

);



// Delete

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post deleted
 */
router.delete(

"/:id",

protect,

controller.deletePost

);

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: Like a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a6566d00cc7df1c391d608f
 *         description: Post ID
 *
 *     responses:
 *       200:
 *         description: Post liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 message:
 *                   type: string
 *                   example: Post liked
 *
 *                 likes:
 *                   type: integer
 *                   example: 1
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Post not found
 */
router.post(
"/:id/like",
protect,
controller.likePost
);

// Unlike Post
/**
 * @swagger
 * /api/posts/{id}/unlike:
 *   post:
 *     summary: Unlike a post
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 6a6566d00cc7df1c391d608f
 *
 *     responses:
 *       200:
 *         description: Post unliked
 *
 *       401:
 *         description: Unauthorized
 *
 *       404:
 *         description: Post not found
 */
router.post(
"/:id/unlike",
protect,
// postController.unlikePost
controller.unlikePost
);



// Get Likes
/**
 * @swagger
 * /api/posts/{id}/likes:
 *   get:
 *     summary: Get post likes count
 *     tags:
 *       - Posts
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *
 *     responses:
 *       200:
 *         description: Likes count returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 likes:
 *                   type: integer
 *                   example: 5
 *
 *       404:
 *         description: Post not found
 */
router.get(
"/:id/likes",
controller.getLikes
);




/**
 * @swagger
 * /api/posts/{id}/bookmark:
 *   post:
 *     summary: Bookmark a post
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post bookmarked
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post(
    "/:id/bookmark",
    protect,
    controller.bookmarkPost
);

/**
 * @swagger
 * /api/posts/{id}/bookmark:
 *   delete:
 *     summary: Remove a post from bookmarks
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post removed from bookmarks
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.delete(
    "/:id/bookmark",
    protect,
    controller.unbookmarkPost
);

module.exports=router;
