const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const { generateToken } = require("../services/utils");
const { emailService } = require("../services");
const fs = require("fs");

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
			const { id } = req.User;
			const user = await User.findByPk(id);
			if (user) {
				return res
					.status(200)
					.json({ message: "berhasil mengambil data", user, newToken });
			} else {
				return res.status(404).json({ message: "data tidak ditemukan" });
			}
		} catch (error) {
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},
	changeUsername: async (req, res) => {
		try {
			const { username } = req.body;
			const { id } = req.User;
			const user = await User.findByPk(id);
			await db.sequelize.transaction(async (t) => {
				await User.update(
					{ username },
					{ where: { id: id } },
					{ transaction: t }
				);
				await emailService.sendNotificationEmail(user, "username");
				res.status(200).json({ message: "Username berhasil diubah" });
			});
		} catch (error) {
			res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},
	changePassword: async (req, res) => {
		try {
			const { newPassword } = req.body;
			const { id } = req.User;
			const user = await User.findByPk(id);
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			await db.sequelize.transaction(async (t) => {
				await User.update(
					{ password: hashedPassword },
					{ where: { id: id } },
					{ transaction: t }
				);
				await emailService.sendNotificationEmail(user, "password");
				res.status(200).json({
					message: `Selamat ${user.username} Password berhasil diubah`,
				});
			});
		} catch (error) {
			res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	changeEmail: async (req, res) => {
		try {
			const { email } = req.body;
			const { id } = req.User;
			await db.sequelize.transaction(async (t) => {
				await User.update(
					{ email, isVerified: false },
					{ where: { id: id } },
					{ transaction: t }
				);
				const user = await User.findByPk(id);
				const token = await generateToken(id);
				await emailService.sendVerificationEmail(user, token);
				res.status(200).json({
					message: `Selamat ${user.username} Email berhasil diubah, silahkan verifikasi ulang`,
					user,
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
			const { id } = req.User;
			const user = await User.findByPk(id);
			await db.sequelize.transaction(async (t) => {
				await User.update({ phone }, { where: { id: id } }, { transaction: t });
				await emailService.sendNotificationEmail(user, "phone");
				return res
					.status(200)
					.json({ message: `Selamat ${user.username} Phone berhasil diubah` });
			});
		} catch (error) {
			res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	changeAvatar: async (req, res) => {
		try {
			const { id } = req.User;
			const user = await User.findByPk(id);
			const oldAvatar = user.imgProfile;
			if (oldAvatar) {
				await fs.unlinkSync(oldAvatar);
			}
			await db.sequelize.transaction(async (t) => {
				await User.update(
					{
						imgProfile: req.file.path,
					},
					{ where: { id: id } },
					{ transaction: t }
				);
				return res.status(200).json({
					message: "Avatar berhasil diubah",
					user,
				});
			});
		} catch (error) {
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},
};

module.exports = profileController;
