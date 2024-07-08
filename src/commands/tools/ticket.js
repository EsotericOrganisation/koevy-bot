const {
	EmbedBuilder,
	SlashCommandBuilder,
	PermissionsBitField,
} = require("discord.js");

require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ticket")
		.setDescription("Ticket utility commands")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("add")
				.setDescription("Give a member access to a ticket")
				.addUserOption((option) =>
					option.setName("member").setDescription("The member").setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("open").setDescription("Reopen a closed ticket")
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("rename")
				.setDescription("Rename a ticket")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("The new name for the ticket")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName("delete").setDescription("Force close a ticket")
		),
	async execute(interaction, client) {
		// If user does not have the support role, give error message
		const {supportRoleId} = process.env;

		if (
			!client.guilds.cache
				.get(interaction.guild.id)
				.members.cache.get(interaction.user.id)
				._roles.includes(supportRoleId)
		) {
			return await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setDescription(
							"❌ You do not have the required permissions to execute this command!"
						)
						.setColor(0x6410a2),
				],
				ephemeral: true,
			});
		}

		const {channel} = interaction;

		switch (interaction.options.getSubcommand()) {
			case "add":
				interaction.channel.permissionOverwrites.edit(
					interaction.options.getUser("member").id,
					{ViewChannel: true}
				);

				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(0x6410a2)
							.setDescription(
								`✅ <@${
									interaction.options.getUser("member").id
								}> has been successfully added to the ticket!`
							),
					],
				});

			case "open":
				await channel.edit({
					PermissionOverwrites: [
						{
							id: interaction.guild.roles.everyone,
							allow: [PermissionsBitField.Flags.SendMessages],
						},
					],
				});

				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(0x6410a2)
							.setDescription("✅ The ticket has been reopened."),
					],
				});

			case "rename":
				const newChannel = await channel.setName(
					interaction.options.getString("name")
				);

				return await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(0x6410a2)
							.setDescription(
								`✅ The ticket has been renamed to **${newChannel.name}**`
							),
					],
					ephemeral: true,
				});

			case "delete":
				await interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setColor(0x6410a2)
							.setDescription("✅ The ticket will be deleted in 5 seconds!"),
					],
					ephemeral: true,
				});

				setTimeout(async () => {
					await channel.delete();
				}, 5000);
		}
	},
};