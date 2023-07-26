const { Blog, Category, Country } = require("../models");
const { body } = require("express-validator");

const createBlogRules = [
	body("title")
		.isLength({ max: 100 })
		.withMessage("title tidak boleh melebihi 100 karakter"),
	body("content")
		.isLength({ max: 500 })
		.withMessage("content tidak boleh melebihi 500 karakter"),
	body("categoryId")
		.isNumeric()
		.withMessage("categoryId harus berupa angka")
		.custom(async (value) => {
			const category = await Category.findByPk(value);
			if (!category) {
				throw new Error("Category tidak ditemukan");
			}
		}),
	body("countryId")
		.isNumeric()
		.withMessage("countryId harus berupa angka")
		.custom(async (value) => {
			const country = await Country.findByPk(value);
			if (!country) {
				throw new Error("Country tidak ditemukan");
			}
		}),
];

module.exports = {
	createBlogRules,
};
