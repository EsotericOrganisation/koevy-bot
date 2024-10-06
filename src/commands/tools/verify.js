const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	PermissionsBitField,
} = require("discord.js");

module.exports = {
	disabled: false,
	data: new SlashCommandBuilder()
		.setName("verify")
		.setDescription("Sends a verification panel")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction, client) {
		//Create verification embed
		const verifyEmbed = new EmbedBuilder()
			.setTitle("**__Verification__**")
			.setColor(0x6410a2)
			.setThumbnail(
				"https://media.discordapp.net/attachments/1044272149453619210/1072879092518637668/Rules.png"
			)
			.setImage(
				"https://media.discordapp.net/attachments/1044272149453619210/1073940538094526566/Verify.png"
			)
			.setDescription(
				"Click the button below to get verified. This will grant you access to the rest of the server."
			);

		//Create verification button
		const verifyButton = new ButtonBuilder()
			.setCustomId("verify")
			.setLabel("Verify")
			.setStyle(ButtonStyle.Success);

		//Send Embed & Button
		await interaction.channel.send({
			embeds: [verifyEmbed],
			components: [new ActionRowBuilder().addComponents(verifyButton)],
		});

		await interaction.reply({
			content: "Successfully created a verification panel.",
			ephemeral: true,
		});
	},
};
