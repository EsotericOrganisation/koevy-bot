module.exports = {
	data: {
		name: "star-4",
	},
	async execute(interaction, client) {
		return await require("./rating-general").four(interaction, client);
	},
};
