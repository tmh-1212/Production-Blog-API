const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const sessionController = require("../controllers/sessionController");

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: User Session Management
 */

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get all active sessions
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions
 */
router.get(
    "/",
    authMiddleware,
    sessionController.getSessions
);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     summary: Remove one session
 *     tags: [Sessions]
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
 *         description: Session deleted
 */
router.delete(
    "/:id",
    authMiddleware,
    sessionController.deleteSession
);

/**
 * @swagger
 * /api/sessions:
 *   delete:
 *     summary: Logout all devices
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All sessions removed
 */
router.delete(
    "/",
    authMiddleware,
    sessionController.deleteAllSessions
);

module.exports = router;