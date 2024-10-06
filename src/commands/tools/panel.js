const {
	SlashCommandBuilder,
	EmbedBuilder,
	StringSelectMenuBuilder,
	ActionRowBuilder,
	PermissionsBitField,
} = require("discord.js");

require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("panel")
		.setDescription("Send the Ticket Panel!")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction, client) {
		//If user does not have the support role, give error message
		const {supportRoleId} = process.env;

		if (!interaction.member.roles.cache.has(supportRoleId))
			return await interaction.reply({
				content: `You do not have the required permissions to execute this command!`,
				ephemeral: true,
			});

		//Create Embed
		const embed = new EmbedBuilder()
			.setAuthor({name: "Tickets", iconURL: null})
			.setTitle("**__SUPERIOR TICKETS__**")
			.setColor(0x6410a2)
			.setDescription(
				"Open a Ticket below by Selecting the Product you want Information on!"
			)
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/1044272149453619210/1073901510922084352/Ticket.png"
			)
			// .setFields()
			.setImage(
				"https://media.discordapp.net/attachments/1044272149453619210/1073940537498947584/Ticket.png"
			)
			.setFooter({
				text: "Stop Grinding now, and take the Easy way",
				iconURL:
					"https://cdn.discordapp.com/attachments/1052647799751188510/1073694365647634463/NEW_PFP_img.png",
			});

		//Menu options
		const menuOptions = [
			{
				label: "Bot Lobbies",
				emoji: "<:LevelUP:1073675169442299914>",
				description: "Open a Ticket for Bot Lobbies",
				value: "ticket-bot-lobby",
			},
			{
				label: "Hard Unlocks",
				emoji: "<:Unlock:1073902194706882570>",
				description: "Open a Ticket for Hard Unlocks",
				value: "ticket-hard-unlocks",
			},
			{
				label: "Longshot Lobbies",
				emoji: "<:Longshot:1073675192087355412>",
				description: "Open a Ticket for Longshot Lobbies",
				value: "ticket-longshot-lobby",
			},
			{
				label: "Force Saves",
				emoji: "<:Staff:1073675318310735932>",
				description: "Open a Ticket for our Force Save Service",
				value: "ticket-force-save",
			},
			{
				label: "Nuke",
				emoji: "<:Nuke:1073675216137506817>",
				description: "Open a Ticket for our Nuke Service",
				value: "ticket-nuke",
			},
		];

		//Create Menu
		const menu = new StringSelectMenuBuilder()
			.setCustomId(`ticket-panel-menu`)
			.setMinValues(1)
			.setMaxValues(1)
			.addOptions(menuOptions)
			.setPlaceholder("STOP GRINDING NOW, AND TAKE THE EASY WAY");

		await interaction.deferReply(); //Defer interaction
		await interaction
			.editReply({
				//Reply with nothing
				content: "\u200b",
				ephemeral: true,
			})
			.then(async (reply) => await reply.delete()); //Delete reply

		await interaction.channel.send({
			//Send panel
			embeds: [embed],
			components: [new ActionRowBuilder().setComponents([menu])],
		});
	},
};
