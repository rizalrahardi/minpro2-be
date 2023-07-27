const { Blog, User } = require("../models");
const { blogService } = require("../services");
const attributes = blogService.setAttributes();
const include = blogService.setInclude();
const fs = require("fs");

const blogController = {
	createBlog: async (req, res) => {
		try {
			const { title, content, videoUrl, keywords, categoryId, countryId } =
				req.body;
			const { id } = req.User;
			const newBlog = await Blog.create({
				title,
				content,
				imgBlog: req.file.path,
				videoUrl,
				keywords,
				userId: id,
				categoryId: categoryId,
				countryId: countryId,
			});
			return res
				.status(201)
				.json({ message: "Blog berhasil dibuat", blog: newBlog });
		} catch (error) {
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	getAllBlogs: async (req, res) => {
		try {
			const {
				title,
				categoryId,
				countryId,
				orderBy,
				page = 1,
				limit = 10,
			} = req.query;

			const pagination = blogService.setPagination(page, limit);
			const filteredBlog = blogService.filterBlog(title, categoryId, countryId);
			const blog = await Blog.findAll({
				attributes,
				include,
				where: filteredBlog,
				order: [["createdAt", orderBy === "asc" ? "ASC" : "DESC"]],
				...pagination,
			});
			return res
				.status(200)
				.json({ message: "data berhasil didapatkan", page, limit, data: blog });
		} catch (error) {
			return res.status(500).json({ message: "data gagal didapatkan" });
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
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	getBlogByUser: async (req, res) => {
		try {
			const { id } = req.User;
			const blogs = await Blog.findAll({
				where: { userId: id },
				attributes,
				include,
			});
			return res
				.status(200)
				.json({ message: "data berhasil didapatkan", data: blogs });
		} catch (error) {
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},

	deleteBlog: async (req, res) => {
		try {
			const { id } = req.params;
			const blog = await Blog.findByPk(id, {
				include: [{ model: User, as: "author" }],
			});
			if (!blog) {
				return res.status(500).json({ message: "Blog tidak ditemukan" });
			}
			if (blog.imgBlog) {
				fs.unlinkSync(blog.imgBlog);
			}
			await blog.destroy();
			return res.status(200).json({ message: "Blog berhasil dihapus" });
		} catch (error) {
			return res.status(500).json({ message: "Terjadi kesalahan pada server" });
		}
	},
};

module.exports = blogController;
