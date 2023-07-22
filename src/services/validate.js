const { body } = require("express-validator");
const { User } = require("../models");
const bcrypt = require("bcrypt");

const registerRules = [
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
	body("password")
		.notEmpty()
		.isLength({ min: 6 })
		.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/)
		.withMessage(
			"Password harus harus di isi minimal 6 karakter, mengandung angka, huruf kapital, dan simbol"
		),
	body("confirmPassword")
		.notEmpty()
		.withMessage("Konfirmasi password harus diisi")
		.custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error("Konfirmasi password tidak sesuai dengan password");
			}
			return true;
		}),
];

const loginRules = [
	body("username")
		.if(body("username").exists())
		.exists()
		.withMessage("Username tidak boleh kosong")
		.custom(async (value, { req }) => {
			const user = await User.findOne({ where: { username: value } });
			if (!user) {
				throw new Error("Username salah atau tidak terdaftar");
			}
			req.user = user;
		}),

	body("email")
		.if(body("email").exists())
		.isEmail()
		.withMessage("Email tidak boleh salah")
		.custom(async (value, { req }) => {
			const user = await User.findOne({ where: { email: value } });
			if (!user) {
				throw new Error("Email salah atau tidak terdaftar");
			}
			req.user = user;
		}),

	body("phone")
		.if(body("phone").exists())
		.exists()
		.withMessage("Phone tidak boleh kosong")
		.custom(async (value, { req }) => {
			const user = await User.findOne({ where: { phone: value } });
			if (!user) {
				throw new Error("Phone salah atau tidak terdaftar");
			}
			req.user = user;
		}),

	body("password")
		.notEmpty()
		.withMessage("Password tidak boleh kosong")
		.custom(async (value, { req }) => {
			if (!req.user) {
				throw new Error("User tidak ditemukan");
			}
			const isValidPassword = await bcrypt.compare(value, req.user.password);
			if (!isValidPassword) {
				throw new Error("Password salah");
			}
		}),
];

module.exports = { registerRules, loginRules };
