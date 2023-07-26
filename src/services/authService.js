const db = require("../models");
const User = db.User;
const { hashedPassword } = require("./utils");

const createUser = async (userData) => {
	const { username, email, phone, password, imgProfile } = userData;
	const hashPass = await hashedPassword(password);
	return await db.sequelize.transaction(async (t) => {
		const user = await User.create(
			{
				username,
				email,
				phone,
				password: hashPass,
				imgProfile,
			},
			{ transaction: t }
		);
		return user;
	});
};

const checkLogin = async (loginData) => {
	const { email, username, phone } = loginData;
	const loginScheme = {};
	if (username) loginScheme.username = username;
	if (email) loginScheme.email = email;
	if (phone) loginScheme.phone = phone;

	return (login = await User.findOne({ where: loginScheme }));
};

const resetPass = async (resetData) => {
	const { id } = resetData;
};

module.exports = {
	createUser,
	checkLogin,
};
