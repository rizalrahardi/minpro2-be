const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({
	path: path.resolve(__dirname, "../../.env"),
});

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASS,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

module.exports = transporter;
