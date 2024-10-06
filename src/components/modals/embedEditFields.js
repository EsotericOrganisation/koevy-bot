const {EmbedBuilder} = require("discord.js");
const {readFileSync, writeFileSync} = require("fs");

module.exports = {
	data: {
		name: "embedEditField",
	},
	async execute(interaction) {
		const embed = JSON.parse(readFileSync("./src/json/embed.json"));
		const fieldNumber = interaction.fields.getTextInputValue("fieldNumber");

		embed.fields[fieldNumber - 1] = {
			name: interaction.fields.getTextInputValue("fieldName"),
			value: interaction.fields.getTextInputValue("fieldValue"),
			inline:
				interaction.fields.getTextInputValue("fieldInline") === "true"
					? true
					: false,
		};

		writeFileSync("./src/json/embed.json", JSON.stringify(embed));

		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setDescription("✅ Embed saved successfully.")
					.setColor(0x2f3136),
			],
			ephemeral: true,
		});
	},
};
