const { validationResult } = require("express-validator");

const errorValidate = (req, res, next) => {
	// const errors = validationResult(req);
	// if (!errors.isEmpty() == false) {
	// 	const errorMessages = errors.array().map((error) => error.msg);
	// 	return res.status(400).json({ errors: errorMessages });
	// }

	const errors = validationResult(req);
	if (errors.isEmpty() == false) {
		return res.status(500).json({
			errors: errors.array(),
		});
	}
	next();
};

module.exports = errorValidate;
