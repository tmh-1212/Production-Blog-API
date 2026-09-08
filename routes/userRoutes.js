// const express =
// require("express");


// const router =
// express.Router();


// const protect =
// require("../middleware/authMiddleware");


// const upload =
// require("../middleware/uploadMiddleware");


// const controller =
// require("../controllers/userController");



// // Get profile

// router.get(

// "/profile",

// protect,

// controller.getProfile

// );



// // Update profile

// router.put(

// "/profile",

// protect,

// upload.single("avatar"),

// controller.updateProfile

// );



// module.exports = router;



// //practice for each part 
//       //part 3 :
//  const express =
// require("express");


// const router =
// express.Router();


// const protect =
// require("../middleware/authMiddleware");


// const userController =
// require("../controllers/userController");



// router.get(
// "/profile",
// protect,
// userController.getProfile
// );



// module.exports = router;



//part 4 :


const express =
require("express");


const router =
express.Router();


const protect =
require("../middleware/authMiddleware");


const upload =
require("../middleware/uploadMiddleware");


const controller =
require("../controllers/userController");

const postController =
require("../controllers/postController");




// Get profile

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get logged-in user profile
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */

router.get(

"/profile",

protect,

controller.getProfile

);



// Update profile

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile with optional avatar upload
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Tesfamikael
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               phone:
 *                 type: string
 *                 example: "+251911223344"
 *               bio:
 *                 type: string
 *                 example: Software Developer
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 */

router.put(

"/profile",

protect,

upload.single("avatar"),

controller.updateProfile

);
/**
 * @swagger
 * /api/users/password:
 *   put:
 *     summary: Change user password
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *
 *               currentPassword:
 *                 type: string
 *                 example: oldpassword123
 *
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *
 *     responses:
 *       200:
 *         description: Password updated successfully
 *
 *       400:
 *         description: Wrong current password
 */
router.put(
    "/password",
    protect,
    controller.changePassword
);

/**
 * @swagger
 * /api/users/bookmarks:
 *   get:
 *     summary: Get logged-in user's bookmarked posts with pagination
 *     tags:
 *       - Users
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
    postController.getMyBookmarks
);

module.exports = router;

