const { User, Category, Country } = require("../models");

const setAttributes = () => {
	return { exclude: ["userId", "categoryId", "countryId"] };
};

const setInclude = () => {
	return [
		{ model: User, attributes: ["id", "username", "imgProfile"], as: "author" },
		{ model: Category, attributes: ["id", "categoryName"] },
		{ model: Country, attributes: ["id", "countryName"] },
	];
};

const setPagination = (page, limit) => {
	const offset = (page - 1) * limit;
	return {
		offset,
		limit: parseInt(limit),
	};
};

const checkCategory = (res, categoryId) => {
	if (!categoryId) {
		return res.status(400).json({
			message: "Kategori tidak ditemukan",
		});
	}
};
const checkCountry = (res, countryId) => {
	if (!countryId) {
		return res.status(400).json({
			message: "Negara tidak ditemukan",
		});
	}
};

module.exports = {
	setAttributes,
	setInclude,
	setPagination,
	checkCategory,
	checkCountry,
};
