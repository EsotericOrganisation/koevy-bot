require("dotenv").config();
const {EmbedBuilder} = require("discord.js");

const {welcomeChannelId, welcomeRoleId, ownerId, supportRoleId, guildId} =
	process.env;

module.exports = {
	name: "guildMemberAdd",
	async execute(member, client) {
		const {user, guild} = member;

		if (user.id === ownerId) await member.roles.add(supportRoleId);

		//Create Embed
		const welcomeEmbed = new EmbedBuilder()
			.setTitle("New Member!")
			.setColor(0x6410a2)
			.setDescription(
				`**Hello** <@${member.id}> we hope you enjoy your stay at **Superior** <a:heart3:1069251219505295398>\n\n> **__Make sure to Verify yourself:__**\n> <#1032954502740983849>\n> \n> **__And Check out our Products:__**\n> <#1068032382864740363>\n> <#1068032607629094933>\n> <#1068033404488134767>`
			)
			.setTimestamp()
			.setImage(
				"https://media.discordapp.net/attachments/1044272149453619210/1073940537100476426/Welcome.png"
			)
			.setThumbnail(
				"https://media.discordapp.net/attachments/1044272149453619210/1072879092191469718/Welcome.png"
			)
			.setFooter({
				text: `Member #${guild.memberCount}`,
				iconURL: user.displayAvatarURL(),
			});

		//Add role
		await member.roles.add(welcomeRoleId).catch((err) => console.log(err));

		//Send Embed
		let message;

		try {
			await client.guilds
				.fetch(guildId)
				.then((guild) => guild.channels.cache.get(welcomeChannelId))
				.then(async (channel) => {
					message = await channel.send({
						embeds: [welcomeEmbed],
					});
				});
		} catch (error) {
			console.log("Failed to send welcome message for " + member.username);
			throw new Error(error?.rawError?.message);
		}
	},
};
