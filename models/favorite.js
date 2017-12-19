const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
	itemID: {type: String, required: true},
	itemName: {type: String, required: true},
	userID: {type: Schema.Types.ObjectId, required: true}
}, {timestamps: true});

favoriteSchema.index({userID: 1, itemID: 1}, {unique: true});

module.exports = mongoose.model('Favorite', favoriteSchema);