const { validationResult } = require("express-validator");

// Middleware kustom untuk menangani error validasi
const errorValidate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const errorMessages = errors.array().map((error) => error.msg);
		return res.status(400).json({ errors: errorMessages });
	}
	next();
};

module.exports = errorValidate;
