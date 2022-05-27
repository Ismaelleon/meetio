// Import models
const User = require('../models/User');

async function checkNameAvailability (name) {
	try {
		// Search for a user with the inserted name
		let user = await User.findOne({ name });

		// If user does not exist return true
		if (user === null) {
			return true 
		} else {
			return false
		}

	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	checkNameAvailability
};
