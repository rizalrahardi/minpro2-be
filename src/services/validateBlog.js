const { body } = require("express-validator");
const { Blog, Category, Country } = require("../models");

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
	// body("countryId")
	// 	.notEmpty()
	// 	.withMessage("Country harus diisi")
	// 	.custom(async (value, { req }) => {
	// 		const country = await Country.findByPk(value);
	// 		if (!country) {
	// 			throw new Error("Country tidak ditemukan");
	// 		}
	// 	}),
	// body("categoryId")
	// 	.notEmpty()
	// 	.withMessage("Category harus diisi")
	// 	.custom(async (value, { req }) => {
	// 		const category = await Category.findByPk(value);
	// 		if (!category) {
	// 			throw new Error("Category tidak ditemukan");
	// 		}
	// 	}),
];

module.exports = {
	createBlogRules,
};
