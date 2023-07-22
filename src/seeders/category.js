"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
		await queryInterface.bulkInsert(
			"categories",
			[
				{
					categoryName: "Bisnis",
					createdAt: "2023-01-27 07:52:27",
					updatedAt: "2023-01-27 07:52:27",
				},
				{
					categoryName: "Kesehatan",
					createdAt: "2023-01-27 07:52:27",
					updatedAt: "2023-01-27 07:52:27",
				},
				{
					categoryName: "Politik",
					createdAt: "2023-01-27 07:52:27",
					updatedAt: "2023-01-27 07:52:27",
				},
				{
					categoryName: "Teknologi",
					createdAt: "2023-01-27 07:52:27",
					updatedAt: "2023-01-27 07:52:27",
				},
				{
					categoryName: "Olahraga",
					createdAt: "2023-01-27 07:52:27",
					updatedAt: "2023-01-27 07:52:27",
				},
				{
					categoryName: "Ekonomi",
					createdAt: "2023-01-27 07:52:27",
					updatedAt: "2023-01-27 07:52:27",
				},
				{
					categoryName: "Sosial",
					createdAt: "2023-01-27 07:52:27",
					updatedAt: "2023-01-27 07:52:27",
				},
				{
					categoryName: "internasional",
					createdAt: "2023-01-27 07:52:27",
					updatedAt: "2023-01-27 07:52:27",
				},
			],
			{}
		);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
		await queryInterface.bulkDelete("categories", null, {});
	},
};
