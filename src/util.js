const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require("discord.js");

const util = {
	/**
	 * Returns a random number between provided minimums and maximums
	 * @param {Number} min The minimum possible outcome
	 * @param {Number} max The maximum possible outcome
	 * @returns {Number}
	 */
	RNG: (min, max) => {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},
	/**
	 * Capitalises the first letter of a string
	 * @param {String} str The text
	 * @returns {String}
	 */
	capitaliseFirst: (str) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	/**
	 * Loops a function a specific amount of times
	 * @param {Function} callback The function to evaluate in the loop. The function is given 1 parameter which is the current loop.
	 * @param {Number} amount The amount of times to run the loop.
	 * @returns {void}
	 * @example util.loop((n) => console.log(n), 3)
	 */
	loop: async (callback, amount) => {
		let i = 0;
		do {
			i++;
			await callback(i);
		} while (i < amount);
		return;
	},
	/**
	 * Disables button(s) after a certain amount of time
	 * @param {any} interaction The interaction which the buttons were replied to
	 * @param {Number} timeout The duration before the buttons get disabled, in milliseconds
	 * @param  {ButtonBuilder[]} buttons The button(s) to disable
	 * @param {...ActionRowBuilder} components The other components in the message
	 */
	buttonTimeout: async (interaction, timeout, buttons, ...components) => {
		Array.isArray(buttons) ? buttons : (buttons = [buttons]);

		const disabledRow = new ActionRowBuilder();

		buttons.forEach((button) => {
			disabledRow.addComponents(button.setDisabled(true));
		});

		components.push(disabledRow);

		setTimeout(async () => {
			try {
				await interaction.editReply({
					components: components,
				});
			} catch {
				await interaction.edit({
					components: components,
				});
			}
		}, timeout);
	},
	/**
	 * Build Buttons without cluttering your files
	 * @param {String} id The custom ID for this button
	 * @param {String} label The text that appears on the button
	 * @param {Boolean} disabled Whether the button should be disabled
	 * @param {ButtonStyle} style The style of the button
	 * @returns {ButtonBuilder} A button
	 */
	buttonBuilder: (id, label, disabled, style, emoji) => {
		const button = new ButtonBuilder()
			.setCustomId(id)
			.setLabel(label)
			.setStyle(style)
			.setDisabled(disabled);

		emoji ? button.setEmoji(emoji) : void 0;

		return button;
	},
	/**
	 * Wraps a line of text into a simple blue embed
	 * @param {String} str The text to wrap
	 * @returns {EmbedBuilder}
	 */
	embedWrap: (str) => {
		return new EmbedBuilder()
			.setColor("Purple")
			.setDescription(str)
			.setTimestamp();
	},
	getOnline: (guild) => {
		let online = 0;
		guild.presences.cache.forEach((presence) => {
			if (presence.status !== "offline") online++;
		});
		return online;
	},
	getBots: (guild) => {
		let bots = 0;
		guild.members.cache.forEach((member) => {
			if (member.user.bot) bots++;
		});
		return bots;
	},
	/**
	 *
	 * @param {String} varenv
	 * @returns
	 */
	toArray: (varenv) => {
		return varenv.split(", ");
	},
};

module.exports = util;
