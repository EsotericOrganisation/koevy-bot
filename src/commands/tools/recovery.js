const {
	SlashCommandBuilder,
	EmbedBuilder,
	ActionRowBuilder,
	PermissionsBitField,
} = require("discord.js");

module.exports = {
	disabled: false,
	data: new SlashCommandBuilder()
		.setName("recovery")
		.setDescription("Sends the Recovery Instructions")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction, client) {
		//Create verification embed
		const embed = new EmbedBuilder()
			.setTitle("**__RECOVERY INSTRUCTIONS__**")
			.setColor(0x6410a2)
			.setImage(
				"https://media.discordapp.net/attachments/1044272149453619210/1073940526388224070/Recovery.png"
			)
			.setThumbnail(
				"https://media.discordapp.net/attachments/1044272149453619210/1072879040396001311/Buroklammern.png"
			)
			.setDescription(
				"For Recovery Services we log on through Xbox so please follow all the steps and only send us Xbox Info.\n\nSteps on how to setup the Account for us:\n\n1. Make an Xbox account if you do not have one\n(https://streamable.com/c62g37)\n\n2. Link the Xbox Account to your Activision\n(https://streamable.com/ddhprx)\n\n3. Setup a byom.de Email and add it as Xbox Recovery Info\n(https://streamable.com/ugm0dn)\n\n4. Confirm the correct Xbox Account is linked to your Activsion as if you link the wrong one and we complete the Service there will be no Refund\n(https://profile.callofduty.com/cod/login?redirectUrl=https%3A%2F%2Fwww.callofduty.com%2F)"
			);

		//Send Embed & Button
		await interaction.channel.send({
			embeds: [embed],
		});

		await interaction.reply({
			content: "Successfully sent the Recovery Instructions",
			ephemeral: true,
		});
	},
};
