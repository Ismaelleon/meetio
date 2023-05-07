const fs = require('fs'),
	jwt = require('jsonwebtoken'),
	path = require('path'),
	{ secret } = require('../../config');

// Import models
const User = require('../models/User');

async function getUser (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {

			// Verify token
			let tokenData = jwt.verify(req.cookies.token, secret);

			// Get the user data
			let user = await User.findOne({ name: tokenData.name });

			// Get all the users
			let allUsers = await User.find({}).select('name avatar pictures description preference description verified');

			let JSONResponse = {};

			for (let selectedUser of allUsers) {
				// If user has tapped at least one user
				if (user.alreadyTappedUsers.length > 0) {

					// Check if the selected user is already tapped ([] = true)
					let isAlreadyTapped = user.alreadyTappedUsers.filter(alreadyTappedUser => alreadyTappedUser.name === selectedUser.name);

					if (isAlreadyTapped.length === 0 && selectedUser.name !== user.name) {
						JSONResponse = selectedUser;
						break;
					} else {
						JSONResponse = {};
					}

				} else {
					if (selectedUser.name !== user.name) {
						JSONResponse = selectedUser;
						break;
					} else {
						JSONResponse = {};
					}
				}

			}

			res.json(JSONResponse)
		} else {
			res.sendStatus(401)
			res.cookie('token', '', { expires: new Date('1969-04-20') })
		}
		
		res.end()
	} catch (error) {
		console.log(error)
	}
}

async function tapUser (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {

			// Get the boolean like
			let tap = req.body.like;

			// Verify token
			let tokenData = jwt.verify(req.cookies.token, secret);

			// Get the user
			let user = await User.findOne({ name: tokenData.name });

			// Remove the user from alreadyTappedUsers
			user.alreadyTappedUsers = user.alreadyTappedUsers.filter(tappedUser => tappedUser.name !== req.body.name);

			// Get the tapped user
			let tappedUser = await User.findOne({ name: req.body.name });
			
			// Add the tapped user to the list
			user.alreadyTappedUsers.push({
				name: tappedUser.name,
				like: tap
			})

			await user.save()
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

module.exports = {
	getUser,
	tapUser
};
