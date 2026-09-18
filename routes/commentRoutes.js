const express =
require("express");


const router =
express.Router();


const protect =
require("../middleware/authMiddleware");


const controller =
require("../controllers/commentController");


const checkOwner =
require("../middleware/checkOwner");

// Create comment

/**
 * @swagger
 * /api/comments/{postId}:
 *   post:
 *     summary: Add a comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Comment created
 */
router.post(

"/:postId",

protect,

controller.createComment

);



// Get comments by post

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: Get comments for a post
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 */

router.get(

"/:postId",

controller.getComments

);



// Delete comment

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not the owner
 *       404:
 *         description: Comment not found
 */

router.delete(

"/:id",

protect, checkOwner ,

controller.deleteComment

);



// Update comment

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Text is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the comment owner
 *       404:
 *         description: Comment not found
 */

router.put(
    "/:id",
    protect,
    controller.updateComment
);



module.exports = router;
