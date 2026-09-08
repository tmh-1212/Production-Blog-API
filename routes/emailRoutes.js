const router =
require("express").Router();


const controller =
require("../controllers/emailController");



/**
 * @swagger
 * /api/auth/verify-email/{token}:
 *   get:
 *     summary: Verify user email
 *     tags:
 *       - Authentication
 */


router.get(
"/verify-email/:token",
controller.verifyEmail
);



module.exports=router;