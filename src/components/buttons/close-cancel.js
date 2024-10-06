module.exports = {
	data: {
		name: "ticket-close-cancel",
	},
	async execute(interaction, client) {
		await require("./close.js").onCancel(interaction, client);
	},
};
