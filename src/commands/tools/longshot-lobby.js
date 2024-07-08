const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, } = require("discord.js");

module.exports = {
  disabled: false,
  data: new SlashCommandBuilder()
    .setName("longshot-lobby")
    .setDescription("Sends the Longshot Lobby Information")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    
    //Create verification embed
    const embed = new EmbedBuilder()
    .setTitle("**__LONGSHOT LOBBIES__**")
    .setColor(0x6410a2)
    .setAuthor({
        iconURL: `https://cdn.discordapp.com/attachments/1052647799751188510/1068583050981683251/NEW_PFP_img.png`,
        name: `Superior`})
    .setThumbnail(`https://cdn.discordapp.com/attachments/1044272149453619210/1073905332272771092/Longshot.png`)
    
    .setFields({
        name: `**Information**`,
        value: `Longshot Lobbies are a easy way to get lots of Longshots so the Grind for Platinum can begin!\n\nPrices can be found on our Sell App:\nhttps://superiorcod.sell.app/product/mw2-longshot-lobby\n\n__**It's very easy Instructions:**__\n\n1. You add us.\n2. You Play your Lobby and Level a ton.\n3. Enjoy!\n\n**ALL** Platorms Supported (__**PlayStation, Xbox, Battle.net, Steam**__)\n\n**__TO BUY OR ASK QUESTIONS OPEN THE PROPER TICKET IN:__**\n<#1073686665840836648>\n\nA preview can be found on our [TikTok](https://www.tiktok.com/@superior.cod)`,
        inline: true
        })
    
    .setImage(`https://media.discordapp.net/attachments/1044272149453619210/1074286530744569937/Longshot-Lobbies.png?width=1246&height=701`)
              
    .setFooter({
        iconURL: `https://cdn.discordapp.com/attachments/1052647799751188510/1068583050981683251/NEW_PFP_img.png`,
        text: "Stop Grinding now, and take the Easy way"
    });

    //Send Embed
    await interaction.channel.send({
        embeds: [embed],
    });

    await interaction.reply({
        content: "Successfully sent the Longshot Lobby Information",
        ephemeral: true
    });
  },
};