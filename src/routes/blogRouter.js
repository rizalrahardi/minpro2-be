const { blogController } = require("../controllers");
const { verifyToken, isVerified } = require("../middlewares/auth");
const errorValidate = require("../middlewares/errorValidate");
const { multerUpload } = require("../middlewares/multer");
const { validateBlog } = require("../services");

const router = require("express").Router();

router.get("/blog", blogController.getAllBlogs);
router.get("/blog/:id", blogController.getBlogById);
router.post(
	"/blog",
	verifyToken,
	isVerified,
	multerUpload.single("imgBlog"),
	validateBlog.createBlogRules,
	errorValidate,
	blogController.createBlog
);

module.exports = router;
