const authService = require("./authService");
const blogService = require("./blogService");
const emailService = require("./emailService");
const utils = require("./utils");
// const validate = require("./validate");
const profileService = require("./profileService");
const validateAuth = require("./validateAuth");
const validateBlog = require("./validateBlog");
const validateProfile = require("./validateProfile");

module.exports = {
	authService,
	emailService,
	// validate,
	utils,
	blogService,
	profileService,
	validateAuth,
	validateBlog,
	validateProfile,
};
