const jwt = require("jsonwebtoken");

const keepLogin = (req, res, next) => {
	let token = req.headers.authorization;
	try {
		token = token.split(" ")[1];
		if (!token) {
			return next();
		}
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				return next();
			}

			const currentTime = Date.now() / 1000;
			const tokenExp = decodedToken.exp;
			const timeUntilExpire = tokenExp - currentTime;
			const FIVE_MINUTES = 5 * 60;

			if (timeUntilExpire <= FIVE_MINUTES) {
				const newToken = jwt.sign(
					{ userId: decodedToken.userId },
					process.env.JWT_SECRET,
					{
						expiresIn: "1h",
					}
				);
				res.setHeader("Authorization", `Bearer ${newToken}`);
				console.log("newtoken", newToken);
				res.locals.newToken = newToken;
			}
			next();
		});
	} catch (error) {
		return res.status(500).json({ message: "Terjadi kesalahan pada server" });
	}
};

module.exports = keepLogin;
