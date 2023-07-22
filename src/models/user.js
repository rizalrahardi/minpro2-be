"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			this.hasMany(models.Blog, {
				foreignKey: "userId",
			});
		}
	}
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			imgProfile: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			isVerified: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			modelName: "User",
		}
	);
	return User;
};
