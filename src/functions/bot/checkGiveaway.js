const GiveawaySchema = require("../../schemas/giveaway.js");
const {
	bold,
	userMention,
	ActionRowBuilder,
	ButtonBuilder,
} = require("discord.js");
const util = require("../../util.js");

const endGiveaway = async (doc, client) => {
	//get random winner
	const winnersArray = [];

	util.loop(() => {
		const random = Math.floor(Math.random() * doc.data.entries.length);
		const winner = doc.data.entries[random];
		winnersArray.push(winner);

		doc.data.entries = doc.data.entries.filter((id) => id !== winner);
	}, doc.data.winners);

	//send message
	const gawChannel = await client.channels.fetch(doc.data.channel);
	const gawMessage = await gawChannel.messages.fetch(doc.data.message);

	await gawMessage.reply({
		content: `Congratulations ${winnersArray.map(
			(winner) => userMention(winner) + ","
		)} on winning ${bold(
			doc.item
		)}! Please open a Ticket within 24hrs to claim your rewards.`,
	});

	await gawMessage.edit({
		components: [
			new ActionRowBuilder().setComponents(
				ButtonBuilder.from(gawMessage.components[0].components[0]).setDisabled(true)
			),
		],
	});

	await doc.update({
		$set: {
			ended: true,
		},
	});
	await doc.save();
};

module.exports = (client) => {
	client.checkGiveaways = async (client) => {
		//Iterate through all giveaways
		const documents = await GiveawaySchema.find();

		for await (const document of documents) {
			if (document.duration <= Date.now() && !document.ended) {
				await endGiveaway(document, client);

				document.data.flagged = true;

				setTimeout(async () => {
					await document.delete();
				}, 1000 * 60 * 60 * 12);

				await document.save();
			} else if (document.ended && !document.data.flagged) {
				setTimeout(async () => {
					await document.delete();
				}, 1000 * 60 * 60 * 12);

				document.data.flagged = true;

				await document.save();
			}
		}
	};
};
