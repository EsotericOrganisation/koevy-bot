const categories = [
	"1073676664900423740",
	"1068614620664844318",
	"1068614500883890176",
	"1068614944288931971",
	"1068595279684702238",
];

module.exports = (client) => {
	client.updateStats = async () => {
		const guild = client.guilds.cache.get(process.env.guildId);
		const channels = guild.channels.cache;
		const tickets = channels.filter((channel) =>
			categories.includes(channel.parentId)
		);

		const statsChannel = channels.get(process.env.statsChannelId);
		await statsChannel.setName(`Open Tickets: ${tickets.size}`);
	};
};
