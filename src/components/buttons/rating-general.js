const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputStyle,
	TextInputBuilder,
} = require("discord.js");

//Create Modal
const modal = new ModalBuilder()
	.setCustomId("feedback-modal")
	.setTitle("Feedback");

modal.addComponents(
	new ActionRowBuilder().addComponents(
		new TextInputBuilder()
			.setCustomId("feedback-modal-value")
			.setLabel("Your Feedback")
			.setPlaceholder("Your Feedback here...")
			.setRequired(true)
			.setStyle(TextInputStyle.Paragraph)
			.setMinLength(20)
			.setMaxLength(200)
	)
);

module.exports = {
	disabled: true, //Not actually
	async one(interaction, client) {
		//Export rating
		client.ticket.rating[interaction.user.id] = 1;

		//Show modal
		await interaction.showModal(modal);
	},
	async two(interaction, client) {
		//Export rating
		client.ticket.rating[interaction.user.id] = 2;

		//Show modal
		await interaction.showModal(modal);
	},
	async three(interaction, client) {
		//Export rating
		client.ticket.rating[interaction.user.id] = 3;

		//Show modal
		await interaction.showModal(modal);
	},
	async four(interaction, client) {
		//Export rating
		client.ticket.rating[interaction.user.id] = 4;

		//Show modal
		await interaction.showModal(modal);
	},
	async five(interaction, client) {
		//Export rating
		client.ticket.rating[interaction.user.id] = 5;

		//Show modal
		await interaction.showModal(modal);
	},
};
