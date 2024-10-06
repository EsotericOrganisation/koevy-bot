module.exports = {
	data: {
		name: "star-1",
	},
	async execute(interaction, client) {
		return await require("./rating-general").one(interaction, client);
	},
};
