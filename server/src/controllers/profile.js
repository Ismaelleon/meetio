const fs = require('fs'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcrypt'),
	path = require('path'),
	cloudinary = require('cloudinary').v2,
	{ cropImage } = require('../helpers/index'),
	{ secret, defaultAvatarFile } = require('../../config');

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
				res.sendStatus(401)
			}
			
		} else {
			res.sendStatus(401)
			res.cookie('token', '', { expires: new Date('1969-04-20') })
		}

		res.end()
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

			if (user !== null) {
				// Delete last avatar file
				let filename = user.avatar.split('/meetio/avatars/')[1].split('.')[0];
				
				if (filename !== defaultAvatarFile) {
					await cloudinary.uploader
						.destroy(`meetio/avatars/${user.avatar.split('/meetio/avatars/')[1].split('.')[0]}`);
				}
				// Crop image
				let crop = JSON.parse(req.body.crop);

				await cropImage(req.file.filename, crop)

				// Upload avatar to cloudinary
				let avatarPath = path.join(__dirname, `../client/build/avatars/${req.file.filename}`);

				result = await cloudinary.uploader.upload(avatarPath, {
					public_id: `meetio/avatars/${req.file.filename}`
				});

				user.avatar = result.url;

				await user.save()

				// Delete the avatar file
				if (user.avatar !== 'avatar.png') {
					fs.unlinkSync(avatarPath)
				}

				res.json({ avatar: user.avatar })
			} else {
				res.sendStatus(401)	
				res.cookie('token', '', { expires: new Date('1969-04-20') })
			}
		} else {
			res.sendStatus(401)
			res.cookie('token', '', { expires: new Date('1969-04-20') })
		}
		
		res.end()
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
			let user = await User.findOne({ name: tokenData.name });

			// Upload files to cloudinary
			for (let file of req.files) {
				let filePath = path.join(__dirname, `../client/build/pictures/${file.filename}`);
				const result = await cloudinary.uploader.upload(filePath, {
					public_id: `meetio/pictures/${file.filename}`
				});

				// Update user pictures list
				user.pictures.push(result.url)

				// Remove picture file
				fs.unlinkSync(path.join(__dirname, `../client/build/pictures/${file.filename}`))
			}

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

					// Remove the file
					const result = await cloudinary.uploader
						.destroy(`meetio/pictures/${pictureName}`);
					
					// Remove that item from the array
					user.pictures.splice(index, 1)
					
					// Save the updated pictures on db
					await user.save()
					
					res.json(user.pictures)
					res.end()
				} else {
					res.cookie('token', '', { expires: new Date('1969-04-20') })
					res.sendStatus(401)
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
					res.sendStatus(401)
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
