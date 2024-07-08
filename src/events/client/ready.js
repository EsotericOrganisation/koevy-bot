require("dotenv").config();
const chalk = require("chalk");

const {guildId} = process.env;

module.exports = {
	name: "ready",
	once: true,
	disabled: false,
	async execute(client) {
		//Set presence and notify console
		setInterval(client.pickPresence, 3 * 1000);
		setInterval(async () => {
			await client.checkGiveaways(client);
		}, 5 * 1000);

		setInterval(async () => {
			await client.updateStats();
		}, 60 * 1000);

		console.log(
			chalk.magenta(client.user.tag + " has logged into Discord successfully!")
		);

		//Clear existing server templates
		await client.guilds.fetch(guildId).then(async (guild) => {
			//Fetch Templates
			await guild.fetchTemplates().then(async (templates) => {
				//Fetch Template made by bot
				const targetTemplate = templates
					.filter((t) => t.name === guild.name + " backup")
					.first();

				//Delete Template
				if (targetTemplate) await targetTemplate.delete();
			});
		});

		//Create a server template
		await client.guilds.fetch(guildId).then(async (guild) => {
			client.backupTemplate = await guild.createTemplate(
				guild.name + " backup",
				"Backup Template in case of server termination."
			);
		});
	},
};
