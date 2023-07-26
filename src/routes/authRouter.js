const router = require("express").Router();
const { authController } = require("../controllers");
const errorValidate = require("../middlewares/errorValidate");
const { multerUpload } = require("../middlewares/multer");
const { verifyToken, isVerified } = require("../middlewares/auth");
const keepLogin = require("../middlewares/keepLogin");
const { validateAuth } = require("../services");
router.post(
	"/register",
	multerUpload.single("imgProfile"),
	validateAuth.registerRules,
	errorValidate,
	authController.register
);
router.post(
	"/login",
	validateAuth.loginRules,
	errorValidate,
	authController.login
);
router.post(
	"/forgot-password",
	validateAuth.forgotPassEmailRules,
	authController.forgotPassword
);
router.patch(
	"/reset-password",
	validateAuth.resetPasswordRules,
	verifyToken,
	authController.resetPassword
);
router.patch("/verify", verifyToken, authController.activateAccount);
module.exports = router;
