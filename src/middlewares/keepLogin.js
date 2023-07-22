const jwt = require("jsonwebtoken");

const keepLogin = (req, res, next) => {
	let token = req.headers.authorization;
	console.log("token atas", token);
	try {
		// Ambil token dari header, query, atau cookie, sesuaikan dengan cara pengiriman token dari klien
		token = token.split(" ")[1];
		console.log("split token", token);
		if (!token) {
			// Jika token tidak ada, lanjutkan ke middleware berikutnya (misalnya verifyToken)
			return next();
		}

		// Verifikasi token menggunakan jwt.verify
		jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
			if (err) {
				// Jika token tidak valid atau sudah kedaluwarsa, lanjutkan ke middleware berikutnya (misalnya verifyToken)
				return next();
			}

			// Periksa apakah token akan kedaluwarsa dalam waktu kurang dari 5 menit
			const currentTime = Date.now() / 1000;
			const tokenExp = decodedToken.exp;
			const timeUntilExpire = tokenExp - currentTime;
			const FIVE_MINUTES = 5 * 60; // 5 menit dalam detik

			if (timeUntilExpire <= FIVE_MINUTES) {
				// Jika token akan kedaluwarsa dalam waktu kurang dari 5 menit, perbarui token dan kirimkan dalam header response
				const newToken = jwt.sign(
					{ userId: decodedToken.userId },
					process.env.JWT_SECRET,
					{
						expiresIn: "1h", // Perpanjang masa berlaku token menjadi 1 jam
					}
				);
				res.setHeader("Authorization", `Bearer ${newToken}`);
				console.log("newtoken", newToken);
				res.locals.newToken = newToken;
			}

			// Lanjutkan ke middleware berikutnya (misalnya verifyToken)
			next();
		});
	} catch (error) {
		// Tangani error jika terjadi kesalahan dalam proses
		console.error("Error pada proses keep login:", error);
		return res.status(500).json({ message: "Terjadi kesalahan pada server" });
	}
};

module.exports = keepLogin;
