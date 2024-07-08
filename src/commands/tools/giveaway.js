const {
	EmbedBuilder,
	SlashCommandBuilder,
	userMention,
	time,
	TimestampStyles,
	inlineCode,
	bold,
	ActionRowBuilder,
	PermissionsBitField,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

const util = require("../../util.js");

const GiveawaySchema = require("../../schemas/giveaway.js");

const ms = require("ms");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("giveaway")
		.setDescription("Create a new giveaway!")
		.setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("create")
				.setDescription("Create a new giveaway")
				.addStringOption((option) =>
					option
						.setName("item")
						.setDescription("The item for giveaway")
						.setRequired(true)
				)
				.addNumberOption((option) =>
					option
						.setName("winners")
						.setDescription("The total winners in the giveaway")
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("time")
						.setDescription("The duration of the giveaway")
						.setAutocomplete(true)
						.setRequired(true)
				)
				.addRoleOption((option) =>
					option
						.setName("requirements")
						.setDescription("The required role to enter the giveaway")
						.setRequired(false)
				)
				.addRoleOption((option) =>
					option
						.setName("bonus_entries")
						.setDescription("The required role for bonus entries")
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("reroll")
				.setDescription("Reroll a giveaway")
				.addStringOption((option) =>
					option
						.setName("id")
						.setDescription("The id of the giveaway to reroll")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("end")
				.setDescription("Force end a giveaway")
				.addStringOption((option) =>
					option
						.setName("id")
						.setDescription("The id of the giveaway to end")
						.setRequired(true)
				)
		),
	async autocomplete(interaction, client) {
		const focusedValue = interaction.options.getFocused(true);
		let choices = ["30 minutes", "1 day", "2 days", "3 days", "1 week"];
		const filtered = choices.filter((choice) =>
			choice.startsWith(focusedValue.value)
		);
		await interaction.respond(
			filtered.map((choice) => ({name: choice, value: choice}))
		);
	},
	async execute(interaction, client) {
		switch (interaction.options.getSubcommand()) {
			case "create":
				//Define variables
				const emoji = "🎉";
				let time_now = Math.floor(Date.now() / 1000);
				const duration = ms(interaction.options.getString("time"));
				const winners = interaction.options.getNumber("winners");

				//Make new giveaway data
				let giveaway = new GiveawaySchema({
					id: interaction.user.id + (await GiveawaySchema.count()),
					item: interaction.options.getString("item"),
					duration: time_now * 1000 + duration,
					ended: false,
					data: {
						author: interaction.user.id,
						winners: winners,
						entries: [],
						bonusRole: interaction.options.getRole("bonus_role")?.id || null,
						requiredRole: interaction.options.getRole("requirements")?.id || null,
						channel: interaction.channel.id,
						flagged: false,
					},
				});

				//Main Embed
				const giveawayEmbed = new EmbedBuilder()
					.setColor(0x6410a2)
					.setTitle(`Giveaway! - Click the Button to Enter`)
					.setThumbnail(
						"https://cdn.discordapp.com/attachments/1052647799751188510/1069367324815138866/NEW_PFP_img.png"
					)

					//Set id of embed
					.setAuthor({name: "ID: " + giveaway.id})
					//Description of Embed

					.setDescription(
						`> Hosted by: ${userMention(interaction.user.id)}
        > Ends in: ${time(
									Math.floor(time_now + duration / 1000),
									TimestampStyles.RelativeTime
								)}
        > Total Entries: ${inlineCode("0")}
        > Total Winners: ${winners}
        > Item: ${bold(interaction.options.getString("item"))}`
					)

					//Embed Fields

					.addFields(
						{
							name: "Required Roles:",
							value: interaction.options.getRole("requirements")?.toString() ?? "None",
						},
						{
							name: "Bonus Entries:",
							value:
								interaction.options.getRole("bonus_entries")?.toString() ?? "None",
						}
					)

					//Timestamp & Footer

					.setTimestamp()

					.setFooter({
						text: `Giveaway!`,
						iconURL: interaction.user.displayAvatarURL(),
					});

				//Create Button
				const button = new ButtonBuilder()
					.setCustomId("giveaway")
					.setLabel("Enter")
					.setEmoji(emoji)
					.setStyle(ButtonStyle.Secondary);

				//Invis reply
				await interaction
					.reply({
						content: "\u200b",
						ephemeral: true,
					})
					.then(async () => await interaction.deleteReply());

				const reply = await interaction.channel.send({
					embeds: [giveawayEmbed],
					components: [new ActionRowBuilder().addComponents(button)],
				});

				giveaway.data.message = reply.id;

				//upload new data
				await giveaway.save();
				break;

			case "reroll":
				const rerollId = interaction.options.getString("id");
				const reroll = await GiveawaySchema.findOne({id: rerollId}).catch(
					async () => {
						return await interaction.reply({
							content: "That giveaway has expired.",
							ephemeral: true,
						});
					}
				);

				if (!reroll.ended)
					return await interaction.reply({
						content: "That giveaway hasn't ended yet!",
						ephemeral: true,
					});

				//get random winner
				const winnersArray = [];

				util.loop(() => {
					const random = Math.floor(Math.random() * reroll.data.entries.length);
					const winner = reroll.data.entries[random];
					winnersArray.push(winner);

					reroll.data.entries = reroll.data.entries.filter((id) => id !== winner);
				}, reroll.data.winners);

				console.log(reroll.data);

				const embed = await interaction.guild.channels
					.fetch(reroll.data.channel)
					.then(
						async (channel) => await channel.messages.fetch(reroll.data.message)
					);

				//send message
				await embed.reply({
					embeds: [
						util.embedWrap(
							"Rerolling giveaway... :long_drum::long_drum::long_drum:",
							false
						),
					],
				});

				await interaction.reply({
					content: "Successfully rerolled the giveaway.",
					ephemeral: true,
				});

				setTimeout(() => {
					embed.reply({
						content: `Congratulations ${winnersArray.map(
							(winner) => userMention(winner) + ","
						)} on winning ${bold(
							reroll.item
						)}! Please open a Ticket within 24hrs to claim your rewards.`,
					});
				}, 3 * 1000);
				break;

			case "end":
				const endId = interaction.options.getString("id");
				const end = GiveawaySchema.findOne({id: endId});

				if (end.ended)
					return await interaction.reply({
						content: "That giveaway has already ended!",
						ephemeral: true,
					});

				//Update data
				await GiveawaySchema.updateOne(
					{id: endId},
					{
						$set: {
							ended: true,
							duration: Date.now(),
						},
					}
				);

				await interaction.reply({
					content: "Successfully ended the giveaway",
					ephemeral: true,
				});

				break;
		}
	},
};
