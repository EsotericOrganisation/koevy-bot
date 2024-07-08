const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('payment-methods')
    .setDescription('Payment Methods')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction, client) {

        const embed = new EmbedBuilder()
            .setFields([
                {
                    name: `**Payment Methods**`,
                    value: `PayPal <:PAYPAL:1069251186877808720> \nBitcoin <:bitcoin:1069251209103421550> \nEthereum <:eth:1069251189218222150> \nGerman Gift Cards <a:pepe_germany:1069251191537680464>`,
                    inline: true
                }
            ])
            .setColor(0x6410a2)
            .setThumbnail("https://media.discordapp.net/attachments/1044272149453619210/1072879052014243960/Money.png")
            .setImage("https://media.discordapp.net/attachments/1044272149453619210/1073940526035910656/Payment-Methods.png")
            .setAuthor({
                iconURL: `https://cdn.discordapp.com/attachments/1068586228443783190/1068842948927705088/NEW_PFP_img.png`,
                name: `Superior Payment Methods`
            })
                
            
            await interaction.channel.send({
                embeds: [embed],
            });
        
            await interaction.reply({
                content: "Successfully sent the Payment Methods",
                ephemeral: true
            });
          },
        };