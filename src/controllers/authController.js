const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const path = require("path");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const transporter = require("../helpers/transporter");

const authController = {
	register: async (req, res) => {
		try {
			const { username, email, phone, password } = req.body;
			// Hash password menggunakan bcrypt
			const hashedPassword = await bcrypt.hash(password, 10);
			// Buat user baru
			await db.sequelize.transaction(async (t) => {
				const newUser = await User.create(
					{
						username,
						email,
						phone,
						password: hashedPassword,
						imgProfile: req.file.path,
					},
					{ transaction: t }
				);

				// Generate token menggunakan jsonwebtoken
				const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
					expiresIn: "24h",
				});

				const data = await fs.readFile(
					path.resolve(__dirname, "../emails/verifyEmail.html"),
					"utf-8"
				);
				const tempComile = await handlebars.compile(data);
				const tempResult = tempComile({ username, token });

				await transporter.sendMail({
					from: process.env.NODEMAILER_USER,
					to: newUser.email,
					subject: "Account Activation",
					html: tempResult,
				});

				// Kirimkan response berhasil beserta token
				return res
					.status(200)
					.json({ message: "Registrasi berhasil", user: newUser, token });
			});
		} catch (error) {
			// Tangani error jika terjadi kesalahan dalam proses registrasi
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body;

			// Cari user berdasarkan email
			const user = await User.findOne({
				where: { email },
			});
			if (!user) {
				return res
					.status(404)
					.json({ message: "User tidak ditemukan, pastikan emailmu benar" });
			}
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: "24h",
			});

			const data = await fs.readFile(
				path.resolve(__dirname, "../emails/forgotPassEmail.html"),
				"utf-8"
			);
			const tempComile = await handlebars.compile(data);
			const tempResult = tempComile({ email, token });

			await transporter.sendMail({
				from: process.env.NODEMAILER_USER,
				to: email,
				subject: "Reset Password",
				html: tempResult,
			});

			res.status(200).json({
				message: "Reset password email dikirim ke emailmu",
				user,
				token,
			});
		} catch (error) {
			res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	resetPassword: async (req, res) => {
		try {
			const { token } = req.params;
			const { password, confirmPassword } = req.body; // Menambahkan confirmPassword dari req.body

			// Verifikasi token menggunakan jwt.verify
			const checkLogin = jwt.verify(token, process.env.JWT_SECRET);

			const userId = checkLogin.id;
			const user = await User.findByPk(userId);
			if (!user) {
				return res.status(404).json({ message: "User tidak ditemukan" });
			}

			if (password !== confirmPassword) {
				return res.status(400).json({
					message: "Konfirmasi password tidak sesuai dengan password baru",
				});
			}

			// Enkripsi password baru menggunakan bcrypt
			const hashedPassword = await bcrypt.hash(password, 10);

			// Update password dan resetToken ke dalam database
			await db.sequelize.transaction(async (t) => {
				await user.update(
					{
						password: hashedPassword,
					},
					{ transaction: t }
				);
			});

			const data = await fs.readFile(
				path.resolve(__dirname, "../emails/notificationEmail.html"),
				"utf-8"
			);
			const tempComile = await handlebars.compile(data);
			const content = {
				subject: "Reset Password",
				username: user.username,
				content: "password",
			};
			const tempResult = tempComile({ content });

			await transporter.sendMail({
				from: process.env.NODEMAILER_USER,
				to: user.email,
				subject: content.subject,
				html: tempResult,
			});

			res.status(200).json({
				message:
					"Password berhasil diubah, silahkan login dengan password baru",
			});
		} catch (error) {
			res.status(500).json({ message: "token invalid" });
		}
	},

	activateAccount: async (req, res) => {
		const { token } = req.params;

		try {
			// Verifikasi token menggunakan jwt.verify
			const checkToken = jwt.verify(token, process.env.JWT_SECRET);

			// Dapatkan userId dari decoded token
			const userId = checkToken.userId;
			// Cari pengguna berdasarkan userId
			const user = await User.findByPk(userId);

			// Jika user ditemukan, set isVerified menjadi true dan simpan perubahan
			if (user) {
				user.isVerified = true;
				await user.save();

				// Kirimkan respons berhasil
				return res.status(200).json({ message: "Akun telah diaktifkan" });
			} else {
				// Jika user tidak ditemukan, kirimkan respons error
				return res.status(404).json({ message: "User tidak ditemukan" });
			}
		} catch (error) {
			// Tangani error jika terjadi kesalahan dalam proses verifikasi token
			return res.status(400).json({ message: "Token tidak valid" });
		}
	},
	login: async (req, res) => {
		try {
			const { email, username, phone } = req.body;

			const loginScheme = {};
			if (username) loginScheme.username = username;
			if (email) loginScheme.email = email;
			if (phone) loginScheme.phone = phone;

			const checkLogin = await User.findOne({ where: loginScheme });

			const user = await User.findByPk(checkLogin.id);

			let payload = { id: checkLogin.id };
			const token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: `24h`,
			});

			return res.status(200).json({ message: "login berhasil", user, token });
		} catch (err) {
			return res
				.status(500)
				.json({ message: "login gagal", error: err.message });
		}
	},
};

module.exports = authController;
