module.exports = {
    data: {
        name: 'star-3'
    },
    async execute(interaction, client) {
        return await require('./rating-general').three(interaction, client);
    }
}