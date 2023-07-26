const { User } = require("../models");
const { body } = require("express-validator");
const bcrypt = require("bcrypt");

const changeUsernameRules = [
	body("username")
		.trim()
		.notEmpty()
		.withMessage("Username harus diisi")
		.custom(async (value) => {
			const existingUser = await User.findOne({ where: { username: value } });
			if (existingUser) {
				throw new Error(
					"Username sudah terdaftar, silakan gunakan username lain"
				);
			}
		}),
];

const changePasswordRules = [
	body("currentPassword")
		.notEmpty()
		.withMessage("Current Password tidak boleh kosong")
		.custom(async (value, { req }) => {
			const user = await User.findByPk(req.User.id);
			const isValidPassword = await bcrypt.compare(value, user.password);
			if (!isValidPassword) {
				throw new Error("Current Password salah");
			}
		}),
	body("newPassword")
		.notEmpty()
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		)
		.withMessage(
			"Password harus di isi minimal 8 karakter, mengandung huruf kapital, angka, dan simbol"
		),
	body("confirmPassword")
		.notEmpty()
		.withMessage("Konfirmasi Password tidak boleh kosong")
		.custom((value, { req }) => {
			if (value !== req.body.newPassword) {
				throw new Error("Konfirmasi password tidak sesuai dengan password");
			}
			return true;
		}),
];

const changeEmailRules = [
	body("email")
		.notEmpty()
		.isEmail()
		.withMessage("Email harus di isi atau Email tidak valid")
		.custom(async (value) => {
			const existingUser = await User.findOne({ where: { email: value } });
			if (existingUser) {
				throw new Error("Email sudah terdaftar, silakan gunakan email lain");
			}
		}),
];

const changePhoneRules = [
	body("phone")
		.notEmpty()
		.isNumeric()
		.withMessage("Nomor telepon harus di isi atau Nomor telepon harus angka")
		.custom(async (value) => {
			if (value) {
				const existingUser = await User.findOne({ where: { phone: value } });
				if (existingUser) {
					throw new Error(
						"Nomor telepon sudah terdaftar, silakan gunakan nomor lain"
					);
				}
			}
		}),
];

module.exports = {
	changeUsernameRules,
	changePasswordRules,
	changeEmailRules,
	changePhoneRules,
};
