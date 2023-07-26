const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const verifyToken = async (req, res, next) => {
	let token = req.headers.authorization;
	if (!token) {
		return res.status(401).send("Access Denied!");
	}

	try {
		token = token.split(" ")[1];

		if (token === "null" || !token) {
			return res.status(401).send("Access Denied!");
		}

		const verifiedUser = await jwt.verify(token, process.env.JWT_SECRET);
		if (!verifiedUser) {
			return res.status(401).send("Unauthorized request");
		}

		req.User = verifiedUser;
		next();
	} catch (err) {
		return res.status(400).send("Invalid Token");
	}
};

const isVerified = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.User.id);
		if (!user) {
			return res.status(404).send("User not found");
		}
		if (!user.isVerified) {
			return res.status(400).send("User not verified, plese verify first");
		}
		next();
	} catch (error) {
		return res.status(500).send("Internal Server Error");
	}
};

module.exports = {
	verifyToken,
	isVerified,
};
