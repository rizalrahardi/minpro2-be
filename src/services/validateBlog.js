const { body } = require("express-validator");
const { Blog } = require("../models");

const createBlogRules = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Title harus diisi")
		.isLength({ max: 100 })
		.withMessage("Title maksimal 100 karakter"),
	body("content")
		.trim()
		.notEmpty()
		.withMessage("Content harus diisi")
		.isLength({ max: 500 })
		.withMessage("Content maksimal 500 karakter"),
];

module.exports = {
	createBlogRules,
};
