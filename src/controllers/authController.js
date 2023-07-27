const db = require("../models");
const User = db.User;
const { createUser, checkLogin } = require("../services/authService");
const { utils, emailService } = require("../services");

const authController = {
	register: async (req, res) => {
		try {
			const { username, email, phone, password } = req.body;
			const newUser = await createUser({
				username,
				email,
				phone,
				password,
				imgProfile: req.file.path,
			});
			const token = await utils.generateToken(newUser.id);
			await emailService.sendVerificationEmail(newUser, token);
			res.status(201).json({
				message: "Registrasi berhasil, silahkan verifikasi akunmu",
				user: newUser,
				token: token,
			});
		} catch (error) {
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body;
			const user = await User.findOne({
				where: { email },
			});
			if (!user) {
				return res.status(400).json({
					message: "email tidak terdaftar",
				});
			}
			const token = await utils.generateToken(user.id);

			await emailService.sendForgotPasswordEmail(user, token);

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
			const { password, confirmPassword } = req.body;
			const { id } = req.User;
			const user = await User.findByPk(id);
			const passwordMatch = await utils.checkPassword(
				password,
				confirmPassword
			);
			if (!passwordMatch) {
				return res.status(400).json({
					message: "confirm password tidak sesuai",
				});
			}
			const hashPass = await utils.hashedPassword(password);
			await db.sequelize.transaction(async (t) => {
				await user.update(
					{
						password: hashPass,
					},
					{ transaction: t }
				);
			});
			await emailService.sendNotificationEmail(user, "password");
			return res.status(200).json({
				message:
					"Password berhasil diubah, silahkan login dengan password baru",
			});
		} catch (error) {
			return res.status(500).json({ message: "token invalid" });
		}
	},

	activateAccount: async (req, res) => {
		try {
			const { id } = req.User;
			const user = await User.findByPk(id);
			if (user.isVerified) {
				return res.status(400).json({
					message: "verifikasi gagal, akun anda sudah terverifikasi",
				});
			}
			await user.update({ isVerified: true });
			return res.status(200).json({
				message: `selamat ${user.username} verifikasi akun berhasil`,
			});
		} catch (error) {
			return res.status(400).json({ message: "Token tidak valid" });
		}
	},
	login: async (req, res) => {
		try {
			const { email, username, phone } = req.body;
			const loginResult = await checkLogin({ email, username, phone });
			const user = await User.findByPk(loginResult.id);
			const token = await utils.generateToken(user.id);

			return res.status(200).json({ message: "login berhasil", user, token });
		} catch (err) {
			return res
				.status(500)
				.json({ message: "login gagal", error: err.message });
		}
	},
	keepLogin: async (req, res) => {
		try {
			const { id } = req.User;
			const user = await User.findByPk(id);
			const token = await utils.generateToken(user.id);
			return res
				.status(200)
				.json({ message: "berhasil mendapat token baru", user, token });
		} catch (err) {
			return res
				.status(500)
				.json({ message: "login gagal", error: err.message });
		}
	},
};

module.exports = authController;
