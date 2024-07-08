const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  disabled: false,
  data: new SlashCommandBuilder()
    .setName("bot-lobby")
    .setDescription("Sends the Bot Lobby Information")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    
    //Create verification embed
    const embed = new EmbedBuilder()
    .setTitle("**__BOT LOBBIES__**")
    .setColor(0x6410a2)
    .setAuthor({
        iconURL: `https://cdn.discordapp.com/attachments/1052647799751188510/1068583050981683251/NEW_PFP_img.png`,
        name: `Superior`})
    .setThumbnail(`https://media.discordapp.net/attachments/1044272149453619210/1073905332679606286/LevelUP.png`)
    
    .setFields({
        name: `**Information**`,
        value: `Bot Lobbies are a easy way to get Multiple Challenges on your Weapons done, or even Maximum Levels!\n\nPrices can be found on our Sell App:\nhttps://superiorcod.sell.app/product/mw2-bot-lobbies\n\n__**It's very easy Instructions:**__\n\n1. You add us.\n2. You Play your Lobby and Level a ton.\n3. Enjoy!\n\n**ALL** Platorms Supported (__**PlayStation, Xbox, Battle.net, Steam**__)\n\n**__TO BUY OR ASK QUESTIONS OPEN THE PROPER TICKET IN:__**\n<#1073686665840836648>\n\nA preview can be found on our [TikTok](https://www.tiktok.com/@superior.cod)`,
        inline: true
        })
    
    .setImage(`https://media.discordapp.net/attachments/1044272149453619210/1074286529167491112/Bot-Lobbies.png?width=1246&height=701`)
              
    .setFooter({
        iconURL: `https://cdn.discordapp.com/attachments/1052647799751188510/1068583050981683251/NEW_PFP_img.png`,
        text: "Stop Grinding now, and take the Easy way"
    });

    //Send Embed
    await interaction.channel.send({
        embeds: [embed],
    });

    await interaction.reply({
        content: "Successfully sent the Bot Lobby Information",
        ephemeral: true
    });
  },
};