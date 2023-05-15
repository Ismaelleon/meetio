const jwt = require('jsonwebtoken');
const { checkUserIsTapped } = require('../helpers/index');

// Import models
const User = require('../models/User');

async function getUserData (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {
			// Get user name
			let { name } = req.body;

			// Get user
			let user = await User.findOne({ name }).select('name avatar pictures description verified');


			// If user exists
			if (user !== null) {
				user = user.toObject();
				
				// Verify Token
				let tokenData = jwt.verify(req.cookies.token, process.env.SECRET);

				let { tapped, liked } = await checkUserIsTapped(tokenData, name);

				if (tapped) {
					user.liked = liked;
				}

				// Send user data
				res.json(user)
			} else {
				// Send "Not Found" HTTP Code
				res.sendStatus(404)
			}
		} else {
			res.sendStatus(401)
			res.cookie('token', '', { expires: new Date('1969-04-20') })
			res.end()
		}
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	getUserData
};
