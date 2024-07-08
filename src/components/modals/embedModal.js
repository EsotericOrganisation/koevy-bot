const {
	EmbedBuilder,
	resolveColor,
	ModalSubmitInteraction,
} = require("discord.js");
const {readFileSync, writeFileSync} = require("fs");

module.exports = {
	data: {
		name: "embedModal",
	},
	/**
	 *
	 * @param {ModalSubmitInteraction} interaction
	 */
	async execute(interaction) {
		let embed = JSON.parse(readFileSync("./src/json/embed.json"));

		const {fields} = interaction;

		const embedData = new EmbedBuilder({
			title: fields.getTextInputValue("title") ?? embed.title,
			description: fields.getTextInputValue("description") ?? embed.description,
			color: resolveColor(fields.getTextInputValue("colour") ?? embed.color),
			url: fields.getTextInputValue("url") ?? embed.url,
			image: {url: fields.getTextInputValue("image") ?? embed.image?.url},
			author: {
				name: fields.getTextInputValue("authorName") ?? embed.authorName,
				icon_url: fields.getTextInputValue("authorIconURL") ?? embed.authorIconURL,
				url: fields.getTextInputValue("authorURL") ?? embed.authorURL,
			},
			footer: {
				text: fields.getTextInputValue("footerText") ?? embed.footerText,
				icon_url: fields.getTextInputValue("footerIconURL") ?? embed.footerIconURL,
			},
			thumbnail: {
				url: fields.getTextInputValue("thumbnail") ?? embed.thumbnail?.url,
			},
			timestamp: fields.getTextInputValue("timestamp") ?? embed.timestamp,
		});

		embed = {
			...embed,
			authorName: fields.getTextInputValue("authorName") ?? embed.authorName,
			authorIconURL:
				fields.getTextInputValue("authorIconURL") ?? embed.authorIconURL,
			authorURL: fields.getTextInputValue("authorURL") ?? embed.authorURL,
			footerText: fields.getTextInputValue("footerText") ?? embed.footerText,
			footerIconURL:
				fields.getTextInputValue("footerIconURL") ?? embed.footerIconURL,
			image: fields.getTextInputValue("image") ?? embed?.image?.url,
			thumbnail: fields.getTextInputValue("thumbnail") ?? embed.thumbnail?.url,
			...embedData,
		};

		writeFileSync("./src/json/embed.json", JSON.stringify(embedData));

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setDescription("✅ Successfully saved the embed.")
					.setColor(0x2f3136),
			],
			ephemeral: true,
		});
	},
};
