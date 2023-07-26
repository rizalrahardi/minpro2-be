const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const handlebars = require("handlebars");

const hashedPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

const generateToken = async (id) => {
	return await jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "24h",
	});
};

const decodedToken = async (token) => {
	return await jwt.verify(token, process.env.JWT_SECRET);
};

const checkPassword = async (password, confirmPassword) => {
	return password === confirmPassword;
};

module.exports = {
	hashedPassword,
	generateToken,
	decodedToken,
	checkPassword,
};
