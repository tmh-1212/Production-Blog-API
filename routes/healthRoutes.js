const express = require("express");

const router = express.Router();



/**
 * @swagger
 * tags:
 *   name: Health
 *   description: API health monitoring
 */


/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 time:
 *                   type: string
 *                   example: 2026-07-24T10:30:00.000Z
 *                 uptime:
 *                   type: number
 *                   example: 120.45
 */
router.get(
    "/health",
    (req, res) => {

        res.json({

            status: "OK",

            time: new Date(),

            uptime: process.uptime()

        });

    }
);



module.exports = router;