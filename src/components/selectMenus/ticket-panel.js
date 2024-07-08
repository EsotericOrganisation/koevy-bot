const {
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
  ButtonStyle,
  ActionRowBuilder,
  bold,
  userMention,
  roleMention,
  channelMention,
} = require("discord.js");

const util = require("../../util");

require("dotenv").config();

module.exports = {
  data: {
    name: "ticket-panel-menu",
  },
  async execute(interaction, client) {
    await interaction.deferUpdate({ ephemeral: true }); //Defer reply

    //Your variables
    const { supportRoleId, guildId } = process.env;

    //Input category IDs in here
    const ticketData = {
      "bot-lobby": { category: "1068595279684702238", overflow: "", name: "Bot Lobbies" },
      "longshot-lobby": { category: "1068614944288931971", overflow: "", name: "Longshot Lobbies" },
      "force-save": { category: "1068614500883890176", overflow: "", name: "Force Save" },
      "hard-unlocks": { category: "1068614620664844318", overflow: "", name: "Hard Unlocks" },
      "nuke": { category: "1073676664900423740", overflow: "", name: "Nuke Service" },
    };

    const panelType = interaction.values[0].replace(/ticket-/gi, "");
    const { category, overflow, name } = ticketData[panelType];

    const guild = await client.guilds.fetch(guildId);

    //Make buttons
    const closeButton = util.buttonBuilder(
      "ticket-close",
      "Close",
      false,
      ButtonStyle.Danger,
      "🔏"
    );

    let ticketChannel;

    //Reset select menu
    await interaction.editReply({
      embeds: [new EmbedBuilder(interaction.message.embeds[0].data)],
    });

    try {
      //Attempt to create ticket in non-overflow category

      //Create ticket channel

      await guild.channels
        .create({
          name: `${panelType.toLowerCase()}-${interaction.user.username.toLowerCase()}`,
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: interaction.user.id,
              allow: [PermissionsBitField.Flags.ViewChannel],
            },
          ],
          parent: category,
        }) //Create ticket, give the ticket requester access to the channel.

        //Send embed and pings

        .then(async (c) => {
          await c.lockPermissions();
          await c.permissionOverwrites.edit(interaction.user.id, {
            ViewChannel: true,
          });

          await c.send({ //Send Embed
            content: `Welcome ${userMention(interaction.user.id)}, please let us know how we can help you today\nSupport team has been pinged ${roleMention(supportRoleId)}`,
            components: [new ActionRowBuilder().addComponents(closeButton)],
            embeds: [
              new EmbedBuilder().setTitle("Information").setDescription(`> You have opened a ticket for ${bold(name)}.\n> Support will be with you Shortly.\n> To close this Ticket react with 🔒`).setColor(0x6410a2),
            ],
          });

          ticketChannel = c.id;
        });

    } catch (err) {
      //If attempt fails, do the same thing in the overflow category

      if (!overflow)
        return await interaction.editReply({
          content: `Sorry, this ticket type is currently full. Please try again later.`,
          ephemeral: true,
        });
      //Create ticket channel

      await guild.channels
        .create({
          name: `${panelType.toLowerCase()}-${interaction.user.username.toLowerCase()}`,
          type: ChannelType.GuildText,
          parent: overflow,
        }) //Create ticket, give the ticket requester access to the channel.

        //Send embed and pings

        .then(async (c) => {
          await c.lockPermissions();
          await c.permissionOverwrites.edit(interaction.user.id, {
            ViewChannel: true,
          });

          await c.send({
            //Send Embed
            content: `Welcome ${userMention(interaction.user.id)}, please let us know how we can help you today\nSupport team has been pinged ${roleMention(supportRoleId)}`,
            components: [new ActionRowBuilder().addComponents(closeButton)],
            embeds: [
              new EmbedBuilder().setTitle("Information").setDescription(`> You have opened a ticket for ${bold(name)}.\n> Support will be with you Shortly.\n> To close this Ticket react with 🔒`).setColor(0x6410a2),
            ],
          });

          ticketChannel = c.id;
        })

        //Check if overflow is full

        .catch(
          async () =>
            await interaction.editReply({
              content: `Sorry, the overflow for this ticket type is full. Please try again later`,
              ephemeral: true,
            })
        );
    }

    //reply ephemerally "your ticket was opened in {ticket name}"
    return ticketChannel
      ? await interaction.followUp({
          content: `Your ticket has been created in ${channelMention(ticketChannel)}!`,
          ephemeral: true,
        })
      : void ticketChannel;
  },
};
