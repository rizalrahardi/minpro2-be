const fs = require("fs").promises;
const path = require("path");
const handlebars = require("handlebars");
const transporter = require("../helpers/transporter");

const sendEmail = async (email, subject, content) => {
	await transporter.sendMail({
		to: email,
		subject: subject,
		html: content,
	});
};
const sendVerificationEmail = async (user, token) => {
	const data = await fs.readFile(
		path.resolve(__dirname, "../emails/verifyEmail.html"),
		"utf-8"
	);
	const tempCompile = handlebars.compile(data);
	const tempResult = tempCompile({
		username: user.username,
		token: token,
	});

	await sendEmail(user.email, "Verifikasi Akun", tempResult);
};

const sendForgotPasswordEmail = async (user, token) => {
	const data = await fs.readFile(
		path.resolve(__dirname, "../emails/forgotPassEmail.html"),
		"utf-8"
	);
	const tempCompile = handlebars.compile(data);
	const tempResult = tempCompile({
		username: user.username,
		token: token,
	});

	await sendEmail(user.email, "Reset Password", tempResult);
};

const notificationData = {
	username: {
		message: "username berhasil diubah",
	},
	email: {
		message: "email berhasil diubah",
	},
	phone: {
		message: "nomor telephone berhasil diubah",
	},
	password: {
		message: "password berhasil diubah",
	},
	avatar: {
		message: "avatar berhasil diubah",
	},
};
const sendNotificationEmail = async (user, notification) => {
	const notifChange = notificationData[notification];
	if (!notifChange) {
		return res.status(400).json({ message: "Tidak ada perubahan" });
	}
	const data = await fs.readFile(
		path.resolve(__dirname, "../emails/notificationEmail.html"),
		"utf-8"
	);
	const tempCompile = handlebars.compile(data);
	const tempResult = tempCompile({
		username: user.username,
		notification: notifChange,
	});
	await sendEmail(user.email, "Notifikasi Perubahan Akun", tempResult);
};

module.exports = {
	sendEmail,
	sendVerificationEmail,
	sendForgotPasswordEmail,
	sendNotificationEmail,
};
