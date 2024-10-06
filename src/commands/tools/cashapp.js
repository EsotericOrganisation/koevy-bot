const {isLinkButton} = require("discord-api-types/utils/v10");
const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	PermissionsBitField,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("cashapp")
		.setDescription("Payment Information of Cashapp")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("Select the the User which needs to pay the Bill")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("price")
				.setDescription("Price of the chosen Products")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("product")
				.setDescription("List the Ordered Prodcuts")
				.setRequired(true)
		),
	async execute(interaction, client) {
		const user = interaction.options.getUser("user"); // Returns a user
		const price = interaction.options.getString("price"); // Returns a string
		const product = interaction.options.getString("product"); // Returns a string

		const embed = new EmbedBuilder()
			.addFields([
				{
					name: `**Information**`,
					value: `> **Biller:** ${interaction.user}\n> **User:** ${user}\n> **Price:** $${price}\n> **Product:** ${product}\n\n\`Please send the Money without any Note!\``,
					inline: true,
				},
			])
			.setColor(0x6410a2)
			.setFooter({
				iconURL: interaction.user.displayAvatarURL(),
				text: interaction.user.tag,
			})
			.setImage(
				`https://media.discordapp.net/attachments/1044272149453619210/1073940525645832323/Payment.png`
			)
			.setThumbnail(
				`https://media.discordapp.net/attachments/1044272149453619210/1072879052014243960/Money.png`
			)
			.setTimestamp(Date.now())
			.setAuthor({
				url: `https://cash.app/$aggravatedx`,
				iconURL: `https://cdn.discordapp.com/attachments/1068586228443783190/1068842948927705088/NEW_PFP_img.png`,
				name: `Superior Cashapp Payment`,
			});

		const button = new ButtonBuilder()
			.setLabel("Pay!")
			.setURL("https://cash.app/$aggravatedx")
			.setStyle(5);

		await interaction.reply({
			embeds: [embed],
			components: [new ActionRowBuilder().addComponents(button)],
		});
	},
};
