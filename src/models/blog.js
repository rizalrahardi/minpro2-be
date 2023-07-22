"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Blog extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.belongsTo(models.User, {
				foreignKey: "userId",
				as: "author",
			});
			this.belongsTo(models.Category, {
				foreignKey: "categoryId",
			});
			this.belongsTo(models.Country, {
				foreignKey: "countryId",
			});
		}
	}
	Blog.init(
		{
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			imgBlog: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			videoUrl: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			keywords: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			sequelize,
			modelName: "Blog",
		}
	);
	return Blog;
};
