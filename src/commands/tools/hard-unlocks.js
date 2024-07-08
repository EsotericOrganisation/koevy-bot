const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, } = require("discord.js");

module.exports = {
  disabled: false,
  data: new SlashCommandBuilder()
    .setName("hard-unlocks")
    .setDescription("Sends the Hard Unlocks Information")
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction, client) {
    
    //Create verification embed
    const embed = new EmbedBuilder()
    .setTitle("**__HARD UNLOCKS__**")
    .setColor(0x6410a2)
    .setAuthor({
        iconURL: `https://cdn.discordapp.com/attachments/1052647799751188510/1068583050981683251/NEW_PFP_img.png`,
        name: `Superior`})
    .setThumbnail(`https://media.discordapp.net/attachments/1044272149453619210/1073901510313914468/Unlock.png`)
    
    .setFields({
        name: `**Information**`,
        value: `Hard Unlocks is the easiest way for you to get Camos & Levels for your Weaponsn\n\n**We Need Login to your Account, but Don't Worry we have several Vouches so you can proove yourself**\n\n**__NO MW2 MULTIPLAYER NEEDED__**\n\nPrices can be found on our Sell App:\nhttps://superiorcod.sell.app/?browse=products&cursor=&group=9985\n\n__**It's very easy Instructions:**__\n\n1. You link your Activision Account to an XBOX/Microsoft Account.\n\n2. You Add a Recovery Mail on Microsoft (https://www.byom.de)\n\n3. We log onto the Account and Grind all the Challenges Legitimate with nothing but our Bot Lobbies (https://superiorcod.sell.app/product/mw2-bot-lobbies)\n\n**ALL** Platorms Supported (__**PlayStation, Xbox, Battle.net, Steam**__)\n\n**__TO BUY OR ASK QUESTIONS OPEN THE PROPER TICKET IN:__**\n<#1073686665840836648>\n\nA preview can be found on our [TikTok](https://www.tiktok.com/@superior.cod)`,
        inline: true
        })
    
    .setImage(`https://media.discordapp.net/attachments/1044272149453619210/1074286530169933935/Hard-Unlocks.png?width=1246&height=701`)
              
    .setFooter({
        iconURL: `https://cdn.discordapp.com/attachments/1052647799751188510/1068583050981683251/NEW_PFP_img.png`,
        text: "Stop Grinding now, and take the Easy way"
    });

    //Send Embed
    await interaction.channel.send({
        embeds: [embed],
    });

    await interaction.reply({
        content: "Successfully sent the Hard Unlock Information",
        ephemeral: true
    });
  },
};