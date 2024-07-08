module.exports = {
    data: {
        name: 'ticket-close-confirm'
    },
    async execute(interaction, client) {
        return await require('./close.js').onConfirm(interaction, client);
    }
}