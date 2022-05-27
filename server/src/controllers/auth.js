const bcrypt = require('bcrypt'),
	fs = require('fs'),
	jwt = require('jsonwebtoken'),
	mongoose = require('mongoose'),
	path = require('path'),
	{ secret } = require('../config');

// Import models
const User = require('../models/User');

// Import helpers
const { checkNameAvailability } = require('../helpers/index.js');

async function signUp (req, res) {
	try {
		// Get request data
		let name = req.body.name,
			password = req.body.password;

		// Check if username is not already in use
		let nameIsAvailable = await checkNameAvailability(name);

		if (nameIsAvailable) {
			// Encrypt password
			let hashedPassword = await bcrypt.hash(password, 10);

			// Generate JSON web token
			let token = jwt.sign({ name: name }, secret);

			// Set user to be saved
			let saveUser = new User({
				name: name,
				password: hashedPassword,
				likedUsers: [],
				dislikedUsers: [],
				alreadyTappedUsers: [],
				avatar: 'avatar.png',
				verified: false
			});

			// Save user data on db
			await saveUser.save()
			  
			// Session Cookie
			res.cookie('token', token, { expires: new Date(Date.now() + 604800000) })
		} else {
			res.sendStatus(409)
		}

		res.end()
	} catch (error) {
		console.log(error)
	}
}

async function signUpDetails (req, res) {
	try {
		// Verify token
		let tokenData = jwt.verify(req.cookies.token, secret);

		// Get user
		let user = await User.findOne({ name: tokenData.name });

		// If the user exists
		if (user.length !== null) {
			// Update user avatar
			user.avatar = req.file.filename;

			// Update user description
			user.description = req.body.description;

			// Save user data
			await user.save()
		} else {
			// Send the "NOT FOUND" http code
			res.sendStatus(404)
		}

		// End request
		res.end()

	} catch (error) {
		console.log(error)
	}
}

async function signIn (req, res) {
	try {
		// Get request data
		let name = req.body.name,
			password = req.body.password;

		// Search user in db
		let user = await User.findOne({ name });

		if (user !== null) {
			let passwordsMatches = await bcrypt.compare(password, user.password);
			
			if (passwordsMatches) {
				// Generate JSON web token
				let token = jwt.sign({name: user.name}, secret);

				// Save token cookie (expires in 1 week)
				res.cookie('token', token, { expires: new Date(Date.now() + 604800000) })
			} else {
				// Send the "UNAUTHORIZED" http code
				res.sendStatus(401)
			}
		}

		// End request
		res.end()
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	signUp,
	signUpDetails,
	signIn
}
