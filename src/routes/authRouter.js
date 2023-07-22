const router = require("express").Router();
const { authController } = require("../controllers");
const errorValidate = require("../middlewares/errorValidate");
const { registerRules, loginRules } = require("../services/validate");
const { multerUpload } = require("../middlewares/multer");
const { verifyToken } = require("../middlewares/auth");
const keepLogin = require("../middlewares/keepLogin");
router.post(
	"/register",
	multerUpload.single("imgProfile"),
	registerRules,
	errorValidate,
	authController.register
);
router.post("/login", loginRules, errorValidate, authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.patch("/reset-password/:token", authController.resetPassword);
router.patch("/verify/:token", authController.activateAccount);
module.exports = router;
