const chalk = require("chalk");
const fs = require("fs");
const {connection} = require("mongoose");

/**
 * main.js => @handleEvents => events\(client/mongo)\files
 * This file is run as long as the bot is online (npm run test or node .)
 */
/**
 * @param {Client} client The client object declared and imported from main.js. This object is used almost everywhere throughout the code.
 */

module.exports = (client) => {
	client.handleEvents = async () => {
		const eventFolders = fs.readdirSync(`./src/events`);
		for (const folder of eventFolders) {
			const eventFiles = fs
				.readdirSync(`./src/events/${folder}`)
				.filter((file) => file.endsWith(".js"));

			switch (folder) {
				case "client":
					for (const file of eventFiles) {
						const event = require(`../../events/${folder}/${file}`);
						if (event.disabled) {
							continue;
						} else if (!event?.name) {
							console.log(chalk.red(`[Error] Skipped ${file} (No name property)`));
							continue;
						}
						if (event.once) {
							client.once(event.name, (...args) => event.execute(...args, client));
						} else
							client.on(event.name, (...args) => {
								!event.once ? event.execute(...args, client) : null;
							});
					}
					break;

				case "mongo":
					for (const file of eventFiles) {
						const event = require(`../../events/${folder}/${file}`);
						if (event.disabled) continue;
						else if (!event?.name) {
							console.log(chalk.red(`[Error] Skipped ${file} (No name property)`));
							continue;
						}
						if (event.once)
							connection.once(event.name, (...args) => event.execute(...args, client));
						else
							console.log(
								chalk.greenBright(
									`[ClientEvents] Now listening for ${event.name} MongoDB events`
								)
							);
						connection.on(event.name, (...args) => {
							event.execute(...args, client);
						});
					}
					break;

				default:
					break;
			}
		}
	};
};
