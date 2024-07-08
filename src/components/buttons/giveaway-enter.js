const { EmbedBuilder, inlineCode } = require("discord.js");
const GiveawaySchema = require("../../schemas/giveaway.js");

module.exports = {
    data: {
        name: `giveaway`
    },
    async execute (interaction, client) {
        
        //Find giveaway object
        const giveaway = await GiveawaySchema.findOne({ id: interaction.message.embeds[0].data.author.name.split(/ +/)[1] });

        //Check for requirements/bonus roles
        const { member } = interaction;

        //Exit function if user does not have required role

        if (!member.roles.cache.has(giveaway.data?.requiredRole) && giveaway.data?.requiredRole) return await interaction.reply({
            content: "You don't have the required roles to enter this giveaway!",
            ephemeral: true
        });

        //Check if user is already in the giveaway

        else if (giveaway.data.entries.includes(interaction.user.id)) return await interaction.reply({
            content: "You have already entered this giveaway!",
            ephemeral: true
        });

        //Push twice if user has bonus entries role

        else if (member.roles.cache.has(giveaway.data?.bonusRole)) giveaway.data.entries.push(interaction.user.id, interaction.user.id);

        //Push once if user has required role, but not bonus entry role

        else giveaway.data.entries.push(interaction.user.id);

        //Edit embed
        const editedEmbed = EmbedBuilder.from(interaction.message.embeds[0]).data.description.split("\n");
        editedEmbed.splice(2, 1, "> Total Entries: " + inlineCode(giveaway.data.entries.length));

        await interaction.message.edit({
            embeds: [EmbedBuilder.from(interaction.message.embeds[0]).setDescription(editedEmbed.join("\n"))]
        });

        //Upload new data
        await giveaway.save();

        //End interaction
        await interaction.deferUpdate();
    }
}