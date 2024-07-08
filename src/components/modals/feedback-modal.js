const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

module.exports = {
  data: {
    name: "feedback-modal",
  },
  async execute(interaction, client) {
    //Your variables
    const { guildId, feedbackChannelId, feedbackEmoji } = process.env;

    const rating = client.ticket.rating[interaction.user.id]; //Import the rating from menu/button
    const feedback = interaction.fields.getTextInputValue("feedback-modal-value"); //Import feedback text

    delete client.ticket.rating[interaction.user.id]; //Delete rating to make bot not crash

    //End interaction
    await interaction.deferUpdate();

    //Create feedback embed
    const embed = new EmbedBuilder()
      .setTitle("New Ticket Feedback")
      .setColor(0x6410a2)
      .setImage("https://media.discordapp.net/attachments/1044272149453619210/1073940526769917982/Review.png")
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        {
          name: "Ticket Info",
          value: `> Ticket Creator: ${interaction.user.tag}`,
        },
        {
          name: "Feedback",
          value: `> ${"⭐".repeat(rating)}\n> ${feedback}`,
        }
      )
      .setFooter({
        text: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    const message = await client.guilds
      .fetch(guildId)
      .then(async (guild) => await guild.channels.cache.get(feedbackChannelId))
      .then((channel) => channel.send({ embeds: [embed] })); //Send message to feedback channel

    await message.react(feedbackEmoji);

    //Delete ticket
    await interaction.channel.delete();
  },
};