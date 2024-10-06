const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	PermissionsBitField,
} = require("discord.js");

module.exports = {
	disabled: false,
	data: new SlashCommandBuilder()
		.setName("done")
		.setDescription("Sends the Done Message after a Service is Completed")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction, client) {
		//Create verification embed
		const embed = new EmbedBuilder()
			.setTitle("**__Service Completion__**")
			.setColor(0x6410a2)
			.setImage(
				"https://cdn.discordapp.com/attachments/1044272149453619210/1073940524806971463/Done.png"
			)
			.setThumbnail(
				"https://media.discordapp.net/attachments/1044272149453619210/1074300440134569984/Heart.png"
			)
			.setDescription(
				"Thank you for choosing Superior, we thank you for your Support and hope to see you back soon.\n\nIf you were pleased by our Service Please leave a Review by Closing the Ticket, a pop up will appear asking you for your Review aswell as your Rating in Stars"
			);

		//Send Embed & Button
		await interaction.channel.send({
			embeds: [embed],
		});

		await interaction.reply({
			content: "Successfully sent the Completion Message",
			ephemeral: true,
		});
	},
};
