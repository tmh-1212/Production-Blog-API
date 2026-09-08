const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const controller = require("../controllers/adminController");
const dashboard = require("../controllers/dashboardController");


// All routes require admin
router.use(
    protect,
    adminOnly
);



/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management APIs
 */


/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
    "/users",
    controller.getUsers
);



/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       403:
 *         description: Forbidden
 */
router.get(
    "/statistics",
    dashboard.statistics
);



/**
 * @swagger
 * /api/admin/users/{id}/block:
 *   put:
 *     summary: Block a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User blocked successfully
 *       404:
 *         description: User not found
 */
router.put(
    "/users/:id/block",
    controller.blockUser
);



/**
 * @swagger
 * /api/admin/users/{id}/unblock:
 *   put:
 *     summary: Activate blocked user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activated successfully
 *       404:
 *         description: User not found
 */
router.put(
    "/users/:id/unblock",
    controller.unblockUser
);



/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(
    "/users/:id",
    controller.deleteUser
);



module.exports = router;