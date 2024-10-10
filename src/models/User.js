const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	name: String,
	password: String,
	avatar: {
		url: String,
		public_id: String
	},
	preference: String,
	pictures: [
		{
			url: String,
			public_id: String
		}
	],
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
	},
	social: {
		name: String,
		account: String,
		url: String,
	},
});

let User = mongoose.model('user', userSchema);

module.exports = User;
