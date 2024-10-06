module.exports = {
	data: {
		name: "star-5",
	},
	async execute(interaction, client) {
		return await require("./rating-general").five(interaction, client);
	},
};
