module.exports = {
    data: {
        name: 'star-2'
    },
    async execute(interaction, client) {
        return await require('./rating-general').two(interaction, client);
    }
}