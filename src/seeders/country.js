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
		await queryInterface.bulkInsert("countries", [
			{
				countryName: "Indonesia",
				createdAt: "2023-01-27 07:52:27",
				updatedAt: "2023-01-27 07:52:27",
			},
			{
				countryName: "Malaysia",
				createdAt: "2023-01-27 07:52:27",
				updatedAt: "2023-01-27 07:52:27",
			},
			{
				countryName: "Singapore",
				createdAt: "2023-01-27 07:52:27",
				updatedAt: "2023-01-27 07:52:27",
			},
			{
				countryName: "Thailand",
				createdAt: "2023-01-27 07:52:27",
				updatedAt: "2023-01-27 07:52:27",
			},
			{
				countryName: "Vietnam",
				createdAt: "2023-01-27 07:52:27",
				updatedAt: "2023-01-27 07:52:27",
			},
			{
				countryName: "United States",
				createdAt: "2023-01-27 07:52:27",
				updatedAt: "2023-01-27 07:52:27",
			},
			{
				countryName: "United Kingdom",
				createdAt: "2023-01-27 07:52:27",
				updatedAt: "2023-01-27 07:52:27",
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
