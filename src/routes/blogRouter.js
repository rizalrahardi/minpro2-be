const { blogController } = require("../controllers");
const { verifyToken, isVerified } = require("../middlewares/auth");
const { multerUpload } = require("../middlewares/multer");

const router = require("express").Router();

router.get("/blog", blogController.getAllBlogs);
router.get("blog?category=");
router.get("/blog/:id", blogController.getBlogById);
router.get("/blog?country=");
router.get("/blog?search=");
router.post(
	"/blog",
	verifyToken,
	isVerified,
	multerUpload.single("imgBlog"),
	blogController.createBlog
);
router.patch("/blog/:id");
router.delete("/blog/:id");

module.exports = router;
