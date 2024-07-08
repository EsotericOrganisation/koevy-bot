const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('special-deal')
    .setDescription('Special Deal')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
    async execute(interaction, client) {

        const embed = new EmbedBuilder()
            .setFields([
                {
                    name: `**Special Deal**`,
                    value: `We offer a Special Deal to all our **FIRST** Customers, every first Purchase will recieve 1 Free Lobby on top of the ammount which got bought.`,
                    inline: true
                }
            ])
            .setColor(0x6410a2)
            .setThumbnail (`https://cdn.discordapp.com/attachments/1068500856179273818/1072634980708143124/fire512-512.png`)
            .setImage("https://media.discordapp.net/attachments/1044272149453619210/1073940524442075196/Sepcial-Deal.png")
            .setAuthor({
                iconURL: `https://cdn.discordapp.com/attachments/1068586228443783190/1068842948927705088/NEW_PFP_img.png`,
                name: `Special Deal`
            })
                
            
            await interaction.channel.send({
                embeds: [embed],
            });
        
            await interaction.reply({
                content: "Successfully sent the Special Deal Message",
                ephemeral: true
            });
          },
        };