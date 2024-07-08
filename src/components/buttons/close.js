const {
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

const util = require("../../util");
require("dotenv").config();

module.exports = {
  data: {
    name: "ticket-close",
  },
  async execute(interaction, client) {
    //Your variables
    const { supportRoleId } = process.env;

    //Exit function if person who pressed close is an admin
    if (interaction.member.roles.cache.has(supportRoleId))
      return await interaction.reply({
        content: `You can't use this button because you're staff! If you want to close this ticket, use </ticket delete:1053370634685657209> instead.`,
        ephemeral: true,
      });

    //Make confirmation buttons
    const yes = util.buttonBuilder(
      "ticket-close-confirm",
      "Confirm",
      false,
      ButtonStyle.Danger
    );

    const no = util.buttonBuilder(
      "ticket-close-cancel",
      "Cancel",
      false,
      ButtonStyle.Success
    );

    //End interaction
    await interaction.deferUpdate();

    this.message = await interaction.channel.send({
      content: "Are you sure you want to close this ticket?",
      components: [new ActionRowBuilder().addComponents(yes).addComponents(no)],
    });
  },
  async onConfirm(interaction, client) {

    //Your variables
    const { transcriptChannelId } = process.env;
    //Make rating menu
    const menu = new StringSelectMenuBuilder()
      .setCustomId(`ticket-rating-menu`)
      .setPlaceholder("Rate out of 5 stars")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions([
        {
          label: "1",
          description: "One star",
          emoji: "⭐",
          value: "ticket-rating-1",
        },
        {
          label: "2",
          description: "Two stars",
          emoji: "⭐",
          value: "ticket-rating-2",
        },
        {
          label: "3",
          description: "Three stars",
          emoji: "⭐",
          value: "ticket-rating-3",
        },
        {
          label: "4",
          description: "Four stars",
          emoji: "⭐",
          value: "ticket-rating-4",
        },
        {
          label: "5",
          description: "Five stars",
          emoji: "⭐",
          value: "ticket-rating-5",
        },
      ]);

    //Make rating buttons
    const star1 = util.buttonBuilder(
      "star-1",
      "1",
      false,
      ButtonStyle.Danger,
      "⭐"
    );
    const star2 = util.buttonBuilder(
      "star-2",
      "2",
      false,
      ButtonStyle.Danger,
      "⭐"
    );
    const star3 = util.buttonBuilder(
      "star-3",
      "3",
      false,
      ButtonStyle.Danger,
      "⭐"
    );
    const star4 = util.buttonBuilder(
      "star-4",
      "4",
      false,
      ButtonStyle.Danger,
      "⭐"
    );
    const star5 = util.buttonBuilder(
      "star-5",
      "5",
      false,
      ButtonStyle.Danger,
      "⭐"
    );

    //Switch between action rows

    const row1 = new ActionRowBuilder().addComponents(menu); //select menu
    const row2 = new ActionRowBuilder()
      .addComponents(star1)
      .addComponents(star2)
      .addComponents(star3)
      .addComponents(star4)
      .addComponents(star5); //buttons

    //Close ticket
    await interaction.channel.members
      .map((member) => member.id)
      .forEach(
        async (id) =>
          await interaction.channel.permissionOverwrites
            .edit(id, {
              SendMessages: false,
            })
            .catch()
      );

    //Send embeds and menus/buttons
    await interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x6410a2)
          .setDescription(`> <#${interaction.channel.id}> has been closed.`),
      ]
    });

    await interaction.user.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0x6410a2)
          .setDescription(
            "> You have closed this ticket. Please provide a rating with the buttons below, and provide feedback with the modal once you select a rating."
          )
          .setFooter({
            iconURL: interaction.user.displayAvatarURL(),
            text: "Ticket closed",
          })
          .setTimestamp()
          .setTitle("Feedback would be appreciated!"),
      ],
      components: [row2], //Change to row1 for menu, use row2 for buttons
    });

    //Create transcripts
    const discordTranscripts = require("discord-html-transcripts");
    const attachment = await discordTranscripts.createTranscript(
      interaction.channel,
      {
        saveImages: false,
        filename: `transcript-${interaction.channel.name}.html`,
      }
    );

    //Send transcripts
    await interaction.user.send({ files: [attachment] }).catch(); //to user
    await interaction.guild.channels.cache
      .get(transcriptChannelId)
      .send({ files: [attachment] }); //to log channel

    //End interaction
    await interaction.deferUpdate();
  },
  async onCancel(interaction, reply) {
    //End interaction
    await interaction.deferUpdate();

    //Delete message
    await this.message.delete();
  },
};