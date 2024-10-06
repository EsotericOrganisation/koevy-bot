const {ActivityType} = require("discord.js");

module.exports = (client) => {
	client.pickPresence = async () => {
		const options = [
			{
				type: ActivityType.Playing,
				text: "Cheap",
				status: "dnd",
			},
			{
				type: ActivityType.Listening,
				text: "Bot Lobbies",
				status: "dnd",
			},
			{
				type: ActivityType.Watching,
				text: "$5/Lobby",
				status: "dnd",
			},
		];
		const option = Math.floor(Math.random() * options.length);

		client.user.setPresence({
			activities: [
				{
					name: options[option].text,
					type: options[option].type,
				},
			],
			status: options[option].status,
		});
	};
};
