require("dotenv").config();
const { bold } = require("discord.js");

const { verifyRoleId, guildId } = process.env;

module.exports = {
    data: {
        name: `verify`
    },
    async execute(interaction, client) {

        //Your variables
        const guild = await client.guilds.cache.get(guildId);
        const member = await guild.members.cache.get(interaction.user.id);
        
        //Assign role
        try {
            await member.roles.add(verifyRoleId);   
        } catch (error) {
            await interaction.reply({
                content: `I dont have enough permissions!`,
                ephemeral: true
            });
            console.log(error);
        }

        //End interaction
        await interaction.deferUpdate();

        //Send DM
        await member.send({
            content: "You have successfully verified yourself in " + bold(guild.name) + "!"
        });
    }
}