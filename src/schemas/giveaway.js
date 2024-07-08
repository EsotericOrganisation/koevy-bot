const {model, Schema} = require("mongoose");

const GiveawaySchema = new Schema({
	id: String,
	duration: Date,
	item: String,
	ended: Boolean,
	data: {
		author: String,
		entries: Array,
		bonusRole: String || Object,
		requiredRole: String || Object,
		winners: Number,
		channel: String,
		message: String,
		flagged: Boolean,
	},
});

module.exports = model("Giveaways", GiveawaySchema, "giveaways");
