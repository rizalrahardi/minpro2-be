const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const transporter = require("../helpers/transporter");
const jwt = require("jsonwebtoken");

const profileController = {
	getAllUsers: async (req, res) => {
		try {
			const users = await User.findAll();
			return res.status(200).json({ users });
		} catch (error) {
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	getUser: async (req, res) => {
		const newToken = res.locals.newToken;

		try {
			const userId = req.User.id;
			// Cari pengguna berdasarkan userId
			const user = await User.findByPk(userId);

			// Jika pengguna ditemukan, kirimkan data pengguna dalam response
			if (user) {
				return res
					.status(200)
					.json({ message: "berhasil mengambil data", user, newToken });
			} else {
				// Jika pengguna tidak ditemukan, kirimkan respons error
				return res.status(404).json({ message: "data tidak ditemukan" });
			}
		} catch (error) {
			// Tangani error jika terjadi kesalahan dalam proses mencari pengguna
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},
	changeUsername: async (req, res) => {
		try {
			const { username } = req.body;
			const userId = req.User.id;
			const user = await User.findByPk(userId);
			const isExist = await User.findOne({ where: { username } });
			if (isExist) {
				return res.status(400).json({ message: "Username sudah digunakan" });
			}
			await db.sequelize.transaction(async (t) => {
				await User.update(
					{ username },
					{ where: { id: userId } },
					{ transaction: t }
				);
				const data = await fs.readFile(
					path.resolve(__dirname, "../emails/notificationEmail.html"),
					"utf-8"
				);
				const tempComile = await handlebars.compile(data);
				const content = {
					subject: "Username berhasil diubah",
					username: user.username,
					content: "username",
				};
				const tempResult = tempComile({ content });

				await transporter.sendMail({
					from: process.env.NODEMAILER_USER,
					to: user.email,
					subject: content.subject,
					html: tempResult,
				});

				res.status(200).json({ message: "Username berhasil diubah" });
			});
		} catch (error) {
			res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},
	changePassword: async (req, res) => {
		try {
			const { currentPassword, newPassword, confirmPassword } = req.body;
			const userId = req.User.id;
			const user = await User.findByPk(userId);
			if (!user) {
				return res.status(404).json({ message: "User tidak ditemukan" });
			}
			const isPassMatch = await bcrypt.compare(currentPassword, user.password);
			if (!isPassMatch) {
				return res.status(400).json({ message: "Password tidak sesuai" });
			}
			if (newPassword !== confirmPassword) {
				return res
					.status(400)
					.json({ message: "Konfirmasi password tidak sesuai" });
			}
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			await db.sequelize.transaction(async (t) => {
				await User.update(
					{ password: hashedPassword },
					{ where: { id: userId } },
					{ transaction: t }
				);
				const data = await fs.readFile(
					path.resolve(__dirname, "../emails/notificationEmail.html"),
					"utf-8"
				);
				const tempComile = await handlebars.compile(data);
				const content = {
					subject: "password berhasil diubah",
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
				res.status(200).json({ message: "Password berhasil diubah" });
			});
		} catch (error) {
			res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	changeEmail: async (req, res) => {
		try {
			const { email } = req.body;
			const userId = req.User.id;
			const user = await User.findByPk(userId);
			const isExist = await User.findOne({ where: { email } });
			if (isExist) {
				return res.status(400).json({ message: "Email sudah digunakan" });
			}
			await db.sequelize.transaction(async (t) => {
				await User.update(
					{ email },
					{ where: { id: userId } },
					{ transaction: t }
				);
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
					expiresIn: "24h",
				});
				console.log(token);
				const data = await fs.readFile(
					path.resolve(__dirname, "../emails/verifyEmail.html"),
					"utf-8"
				);
				const tempComile = await handlebars.compile(data);
				const tempResult = tempComile({ token, username: user.username });
				await transporter.sendMail({
					to: user.email,
					subject: "Account Verification",
					html: tempResult,
				});
				res.status(200).json({
					message: "Email berhasil diubah, silahkan verifikasi ulang",
					token,
				});
			});
		} catch (error) {
			res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	changePhone: async (req, res) => {
		try {
			const { phone } = req.body;
			// const userId = req.User.id;
			const user = await User.findByPk(req.User.id);
			const isExist = await User.findOne({ where: { phone } });
			if (isExist) {
				return res.status(400).json({ message: "Phone sudah digunakan" });
			}
			await db.sequelize.transaction(async (t) => {
				await User.update(
					{ phone },
					{ where: { id: user.id } },
					{ transaction: t }
				);
				const data = await fs.readFile(
					path.resolve(__dirname, "../emails/notificationEmail.html"),
					"utf-8"
				);
				const tempComile = await handlebars.compile(data);
				const content = {
					subject: "phone berhasil diubah",
					username: user.username,
					content: "phone",
				};
				const tempResult = tempComile({ content });

				await transporter.sendMail({
					from: process.env.NODEMAILER_USER,
					to: user.email,
					subject: content.subject,
					html: tempResult,
				});
				res.status(200).json({ message: "Phone berhasil diubah" });
			});
		} catch (error) {
			res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	changeAvatar: async (req, res) => {
		try {
			const userId = req.User.id;
			// const newImgProfile = req.file.path;

			await db.sequelize.transaction(async (t) => {
				await User.update(
					{
						imgProfile: req.file.path,
					},
					{ where: { id: userId } },
					{ transaction: t }
				);
				const user = await User.findByPk(userId);

				res.status(200).json({
					message: "Avatar berhasil diubah",
					user,
				});
			});
		} catch (error) {
			res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},
};

module.exports = profileController;
