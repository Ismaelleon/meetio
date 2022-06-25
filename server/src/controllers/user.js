const jwt = require('jsonwebtoken');

// Import models
const User = require('../models/User');

async function getUserData (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {
			// Get user name
			let { name } = req.body;

			// Find user by name
			let user = await User.findOne({ name }).select('name avatar pictures description verified');

			// If user exists
			if (user !== null) {
				// Send user data
				res.json(user)
			} else {
				// Send "Not Found" HTTP Code
				res.sendStatus(404)
			}
		} else {
			res.sendStatus(401)
			res.end()
		}
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	getUserData
};
