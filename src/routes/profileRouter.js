const router = require("express").Router();
const { verifyToken, isVerified } = require("../middlewares/auth");
const { profileController, blogController } = require("../controllers");
const { multerUpload, handleFileSizeError } = require("../middlewares/multer");
const errorValidate = require("../middlewares/errorValidate");
const keepLogin = require("../middlewares/keepLogin");
const { validateProfile } = require("../services");

router.get("/user", verifyToken, keepLogin, profileController.getUser);
router.get("/users", verifyToken, keepLogin, profileController.getAllUsers);
router.patch(
	"/change-username",
	verifyToken,
	isVerified,
	keepLogin,
	validateProfile.changeUsernameRules,
	errorValidate,
	profileController.changeUsername
);
router.patch(
	"/change-password",
	verifyToken,
	isVerified,
	keepLogin,
	validateProfile.changePasswordRules,
	errorValidate,
	profileController.changePassword
);
router.patch(
	"/change-email",
	verifyToken,
	isVerified,
	keepLogin,
	validateProfile.changeEmailRules,
	errorValidate,
	profileController.changeEmail
);
router.patch(
	"/change-phone",
	verifyToken,
	isVerified,
	keepLogin,
	validateProfile.changePhoneRules,
	errorValidate,
	profileController.changePhone
);
router.patch(
	"/change-image",
	verifyToken,
	isVerified,
	keepLogin,
	multerUpload.single("imgProfile"),
	handleFileSizeError,
	profileController.changeAvatar
);
router.get("/blog", verifyToken, isVerified, blogController.getBlogByUser);
router.delete("/blog/:id", verifyToken, isVerified, blogController.deleteBlog);
module.exports = router;
