const { Blog, Category, Country } = require("../models");
const { Op } = require("sequelize");
const { blogService } = require("../services");

const attributes = blogService.setAttributes();
const include = blogService.setInclude();

const blogController = {
	createBlog: async (req, res) => {
		try {
			const { title, content, videoUrl, keywords, categoryId, countryId } =
				req.body;
			const userId = req.User.id;
			// const category = await Category.findByPk(categoryId);
			// if (!category) {
			// 	return res.status(404).json({ message: "Category tidak ditemukan" });
			// }
			// const country = await Country.findByPk(countryId);
			// if (!country) {
			// 	return res.status(404).json({ message: "Country tidak ditemukan" });
			// }
			const newBlog = await Blog.create({
				title,
				content,
				imgBlog: req.file.path,
				videoUrl,
				keywords,
				userId: userId,
				categoryId: categoryId,
				countryId: countryId,
			});

			return res
				.status(201)
				.json({ message: "Blog berhasil dibuat", blog: newBlog });
		} catch (error) {
			console.error("Error pada proses pembuatan blog:", error);
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	getAllBlogs: async (req, res) => {
		const {
			title,
			categoryId,
			countryId,
			orderBy,
			page = 1,
			limit = 10,
		} = req.query;

		const pagination = blogService.setPagination(page, limit);

		const whereClause = {};
		if (title) whereClause.title = { [Op.like]: `%${title}%` };
		if (categoryId) whereClause.categoryId = categoryId;
		if (countryId) whereClause.countryId = countryId;

		try {
			const blog = await Blog.findAll({
				attributes,
				include,
				where: whereClause,
				order: [["createdAt", orderBy === "asc" ? "ASC" : "DESC"]],
				...pagination,
			});
			res
				.status(200)
				.json({ message: "data berhasil didapatkan", page, limit, data: blog });
		} catch {
			res.status(500).json({ message: "data gagal didapatkan" });
		}
	},
	getBlogById: async (req, res) => {
		const { id } = req.params;
		try {
			const blog = await Blog.findByPk(id, {
				attributes,
				include,
			});
			if (!blog) {
				return res.status(404).json({ message: "Blog tidak ditemukan" });
			}
			return res
				.status(200)
				.json({ message: "data berhasil didapatkan", blog });
		} catch (error) {
			console.error(
				"Error pada proses mendapatkan blog berdasarkan ID:",
				error
			);
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	getBlogByUser: async (req, res) => {
		try {
			const { id } = req.User;
			const blogs = await Blog.findAll({
				where: {
					id: id,
				},
				attributes,
				include,
			});
			return res.status(200).json({
				message: "data berhasil didapatkan",
				data: blogs,
			});
		} catch (error) {
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},
};

module.exports = blogController;
