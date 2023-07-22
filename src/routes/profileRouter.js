const router = require("express").Router();
const { verifyToken, isVerified } = require("../middlewares/auth");
const { profileController } = require("../controllers");
const { multerUpload } = require("../middlewares/multer");
const errorValidate = require("../middlewares/errorValidate");
const keepLogin = require("../middlewares/keepLogin");

router.get("/user", verifyToken, keepLogin, profileController.getUser);
router.get("/users", verifyToken, keepLogin, profileController.getAllUsers);
router.patch(
	"/change-username",
	verifyToken,
	isVerified,
	keepLogin,
	profileController.changeUsername
);
router.patch(
	"/change-password",
	verifyToken,
	isVerified,
	keepLogin,
	profileController.changePassword
);
router.patch(
	"/change-email",
	verifyToken,
	isVerified,
	keepLogin,
	profileController.changeEmail
);
router.patch(
	"/change-phone",
	verifyToken,
	isVerified,
	keepLogin,
	profileController.changePhone
);
router.patch(
	"/change-image",
	verifyToken,
	isVerified,
	keepLogin,
	multerUpload.single("imgProfile"),
	profileController.changeAvatar
);

module.exports = router;
