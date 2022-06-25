const fs = require('fs'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcrypt'),
	path = require('path'),
	{ secret } = require('../../config');

// Import model
const User = require('../models/User');

async function getProfileData (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {

			// Verify token
			let tokenData = jwt.verify(req.cookies.token, secret);
			
			// Find user by name
			let user = await User.findOne({ name: tokenData.name }).select('name avatar pictures description verified');

			if (user !== null) {
				res.json(user)
			} else {
				res.cookie('token', '', { expires: new Date('1969-04-20') })
				res.sendStatus(404)
			}
			
			res.end()
		} else {
			res.sendStatus(401)
			res.cookie('token', '', { expires: new Date('1969-04-20') })
			res.end()
		}
	} catch (error) {
		console.log(error)
	}
}

async function changeAvatar (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {

			// Verify token
			let tokenData = jwt.verify(req.cookies.token, secret);

			// Find user by name
			let user = await User.findOne({ name: tokenData.name });
			
			// Remove the previous avatar file (if isn't the default one)
			if (user.avatar !== 'avatar.png') {
				fs.unlinkSync(path.join(__dirname, `../client/build/avatars/${user.avatar}`))
			}

			// Save the new avatar name on db
			user.avatar = req.file.filename;
			await user.save()
			
			// Send the file name to the client
			res.json(user.avatar)
			res.end()
		} else {
			res.sendStatus(401)
			res.cookie('token', '', { expires: new Date('1969-04-20') })
			res.end()
		}
	} catch (error) {
		console.log(error)
	}
}

async function changeDescription (req, res) {
	try {
		let { description } = req.body;
		
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {

			// Verify token
			let tokenData = jwt.verify(req.cookies.token, secret);

			// Find user by name
			let user = await User.findOne({ name: tokenData.name });
			
			if (user !== null) {
				// Update description
				user.description = description;

				// Save user
				await user.save()
			}


			res.end()
		}
	} catch (error) {
		console.log(error)
	}
}

async function uploadPictures (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {

			// Verify token
			let tokenData = jwt.verify(req.cookies.token, secret);

			// Find user by name
			let user = await User.findOne({ name: tokenData.name }).select('pictures');;

			// Append the picture names
			req.files.forEach(file => {
				user.pictures.push(file.filename)
			})
			
			// Save the pictures on db
			await user.save()

			// Return the pictures data
			res.json(user.pictures)
			res.end()
		} else {
			res.sendStatus(401)
			res.cookie('token', '', { expires: new Date('1969-04-20') })
			res.end()
		}
	} catch (error) {
		console.log(error)
	}
}

async function deletePicture (req, res) {
	try {
		// Get picture name from body
		let { pictureName } = req.body;

		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {
				// Verify token
				let tokenData = jwt.verify(req.cookies.token, secret);

				// Find user by token
				let user = await User.findOne({ name: tokenData.name });
			
				if (user !== null) {
					// Get the picture item index inside the array
					let index = user.pictures.indexOf(pictureName);
					
					// Remove that item from the array
					user.pictures.splice(index, 1)

					// Remove the file
					fs.unlinkSync(path.join(__dirname, `../client/build/pictures/${pictureName}`))
					
					// Save the updated pictures on db
					await user.save()
					
					res.json(user.pictures)
					res.end()
				} else {
					res.cookie('token', '', { expires: new Date('1969-04-20') })
					res.sendStatus(404)
					res.end()
				}
			}

	} catch (error) {
		console.log(error)
	}
}

async function deleteAccount (req, res) {
	try {
		// Get password from body
		let { password } = req.body;
	
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {
				// Verify token
				let tokenData = jwt.verify(req.cookies.token, secret);

				// Find user by token
				let user = await User.findOne({ name: tokenData.name });
			
				if (user !== null) {
					// Compare passwords
					let passwordsMatches = await bcrypt.compare(password, user.password);
					
					if (passwordsMatches) {
						// Remove user from 'alreadyTappedUsers' in other users documents
						let allUsers = await User.find({}).select('alreadyTappedUsers');

						for (let currentUser of allUsers) {
							currentUser.alreadyTappedUsers.map((alreadyTappedUser, index) => {
								if (alreadyTappedUser.name === user.name) {
									currentUser.alreadyTappedUsers.splice(index, 1)
								}
							})

							await currentUser.save()
						}

						// Remove user's avatar
						if (user.avatar !== 'avatar.png') {
							fs.unlinkSync(path.join(__dirname, `../client/build/avatars/${user.avatar}`))
						}

						// Remove user's pictures
						for (let picture of user.pictures) {
							fs.unlinkSync(path.join(__dirname, `../client/build/pictures/${picture}`))
						}

						// Remove user
						await User.deleteOne({ _id: user._id })

						res.sendStatus(200)
					} else {
						res.sendStatus(401)
						res.cookie('token', '', { expires: new Date('1969-04-20') })
					}

					res.end()
				} else {
					res.cookie('token', '', { expires: new Date('1969-04-20') })
					res.sendStatus(404)
					res.end()
				}
			}
	
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	getProfileData,
	changeAvatar,
	changeDescription,
	uploadPictures,
	deletePicture,
	deleteAccount
};
