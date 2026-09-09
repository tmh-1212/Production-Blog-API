// const express = require("express");

// const router = express.Router();

// const authController = require("../controllers/authController");

// const validate =
// require("../middleware/validate");


// const {
// registerSchema
// }
// =
// require("../validation/authValidation");


// router.post(

// "/register",

// validate(registerSchema),

// authController.register

// );




// router.post("/login",authController.login);

// router.post(

// "/login",

// loginLimiter,

// controller.login

// );


// module.exports = router;



// //practice for part 2 :
// const express = require("express");
// const router = express.Router();

// const authController = require("../controllers/authController");
// const validate = require("../middleware/validate");

// const {
//     registerSchema
// } = require("../validation/authValidation");

// router.post(
//     "/register",
//     validate(registerSchema),
//     authController.register
// );

// router.post(
//     "/login",
//     authController.login
// );

// module.exports = router;





//Add Swagger documentation to authRoutes.js

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const authMiddleware = require("../middleware/authMiddleware");
const loginLimiter = require("../middleware/loginLimiter");

const {
    registerSchema
} = require("../validation/authValidation");


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication APIs
 */


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates account and sends email verification link
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *                - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tesfamikael
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post(
    "/register",
    validate(registerSchema),
    authController.register
);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
    "/login",
    loginLimiter,
    authController.login
);

/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token sent to user's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired verification token
 */
router.get(
  "/verify-email/:token",
  authController.verifyEmail
);


/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot Password
 *     description: Sends a password reset email if the account exists.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Invalid request
 */

router.post(
    "/forgot-password",
    authController.forgotPassword
);
/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Reset Password
 *     description: Reset user password using reset token.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: NewPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post(
    "/reset-password/:token",
    authController.resetPassword
);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/logout",
    authMiddleware,
  authController.logout
);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 */


router.post(
    "/refresh-token",
    authController.refreshToken
);
module.exports = router;