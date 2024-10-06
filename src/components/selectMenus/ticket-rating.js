const {
	ModalBuilder,
	ActionRowBuilder,
	TextInputBuilder,
	TextInputStyle,
} = require("discord.js");

module.exports = {
	data: {
		name: "ticket-rating-menu",
	},
	async execute(interaction, client) {
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

		//Export rating
		client.ticket.rating[interaction.user.id] = Number.parseInt(
			interaction.values[0].replace("ticket-rating-", "")
		);

		//Show modal
		await interaction.showModal(modal);
	},
};
