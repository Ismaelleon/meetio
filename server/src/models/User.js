const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	name: String,
	password: String,
	avatar: String,
	preference: String,
	pictures: [String],
	description: {
		type: String,
		default: 'A brief description.'
	},
	alreadyTappedUsers: {
		type: [Object],
		default: []
	},
	verified: {
		type: Boolean,
		default: false
	}
});

let User = mongoose.model('user', userSchema);

module.exports = User;
