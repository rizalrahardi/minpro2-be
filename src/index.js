const path = require("path");
require("dotenv").config({
	path: path.resolve(__dirname, "../.env"),
});
const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;

const db = require("./models");
// db.sequelize.sync({ alter: true });

const { authRouter, blogRouter, profileRouter } = require("./routes");

app.use("/api/auth", authRouter);
app.use("/api", blogRouter);
app.use("/api/profile", profileRouter);

app.use("/public", express.static(path.resolve(__dirname, "../public")));

app.listen(PORT, () => {
	console.log("Server running on port " + PORT);
});
