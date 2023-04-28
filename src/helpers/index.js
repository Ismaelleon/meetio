const Jimp = require('jimp'),
	path = require('path');

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

function cropImage (filename, crop) {
	return new Promise((resolve, reject) => {
		Jimp.read(path.join(__dirname, `../client/build/avatars/${filename}`)).then(image => {
			let { x, y, width, height } = crop || {};

			if (x === undefined || y === undefined || width === undefined || height === undefined) {
				x = 0;
				y = 0;
				width = image.bitmap.width / 2;
				height = image.bitmap.width / 2;
			}

			x = x * image.bitmap.width;
			y = y * image.bitmap.height;
			width = width * image.bitmap.width;
			height = height * image.bitmap.height;

			image
				.crop(x, y, width, height)
				.write(path.join(__dirname, `../client/build/avatars/${filename}`))

			resolve(true)
		}).catch(error => reject(error))

	})
}

async function checkUserIsTapped (tokenData, name) {
	try {
		// Get user
		let user = await User.findOne({ name: tokenData.name });

		// If the user exists
		if (user !== null) {
			let tapped = false,
				liked = false;

			// Check if user is already tapped
			for (let tappedUser of user.alreadyTappedUsers) {
				if (tappedUser.name === name) {
					tapped = true;
					liked = tappedUser.like;
				}
			}
			
			return { tapped, liked } 
		}
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	checkNameAvailability,
	cropImage,
	checkUserIsTapped
};
