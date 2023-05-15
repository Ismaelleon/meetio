const fs = require('fs'),
	jwt = require('jsonwebtoken'),
	path = require('path');

// Import model
const User = require('../models/User');

async function likedProfiles (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {

			// Verify token
			let tokenData = jwt.verify(req.cookies.token, process.env.SECRET);

			// Find user by name
			let user = await User.findOne({ name: tokenData.name });
			
			// If user exists
			if (user !== null) {
				// Get all liked profiles
				let likedProfiles = user.alreadyTappedUsers.filter(tappedUser => tappedUser.like === true);

				let likedProfilesData = await Promise.all(likedProfiles.map(async (likedProfile, index) => {
						let profile = await User.findOne({ name: likedProfile.name }).select('name avatar verified');

						return profile
					})
				);

				if (likedProfilesData.length > 0) {
					// Send json data
					res.json(likedProfilesData)
				} else {
					// No liked profiles
					res.sendStatus(204)
				}
			} else {
				// Send the "UNAUTHORIZED" http code
				res.sendStatus(401)
				res.cookie('token', '', { expires: new Date('1969-04-20') })
			}

			// End request
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

async function dislikedProfiles (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {
			// Verify token
			let tokenData = jwt.verify(req.cookies.token, process.env.SECRET);

			// Find user by name
			let user = await User.findOne({ name: tokenData.name });
			
			// If user exists
			if (user !== null) {
				// Get all disliked profiles
				let dislikedProfiles = user.alreadyTappedUsers.filter(tappedUser => tappedUser.like === false);

				let dislikedProfilesData = await Promise.all(dislikedProfiles.map(async (dislikedProfile, index) => {
						let profile = await User.findOne({ name: dislikedProfile.name }).select('name avatar verified');

						return profile
					})
				);

				if (dislikedProfilesData.length > 0) {
					// Send json data
					res.json(dislikedProfilesData)
				} else {
					// No disliked profiles
					res.sendStatus(204)
				}
			} else {
				// Send the "UNAUTHORIZED" http code
				res.sendStatus(401)
				res.cookie('token', '', { expires: new Date('1969-04-20') })
			}

			// End request
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

async function matches (req, res) {
	try {
		// If token is valid and correct
		if (req.cookies.token !== undefined &&
			req.cookies.token.split('.').length === 3) {

			// Verify token
			let tokenData = jwt.verify(req.cookies.token, process.env.SECRET);

			// Find user by name
			let user = await User.findOne({ name: tokenData.name });
			
			// If user exists
			if (user !== null) {
				// Get all liked profiles
				let likedProfiles = user.alreadyTappedUsers.filter(tappedUser => tappedUser.like === true);

				let matchedProfilesData = await Promise.all(likedProfiles.map(async (likedProfile, index) => {
						let profile = await User.findOne({ name: likedProfile.name }).select('name avatar verified alreadyTappedUsers');

						let likedProfileLikes = profile.alreadyTappedUsers.filter(likedProfile => likedProfile.name === user.name);

						if (likedProfileLikes.length > 0) {
							return {
								name: profile.name,
								avatar: profile.avatar,
								verified: profile.verified
							}
						}
					})
				);

				// Remove the undefined items
				matchedProfilesData = matchedProfilesData.filter(matchedProfile => matchedProfile !== undefined);

				if (matchedProfilesData.length > 0) {
					// Send json data
					res.json(matchedProfilesData)
				} else {
					// No matches
					res.sendStatus(204)
				}
			} else {
				// Send the "UNAUTHORIZED" http code
				res.cookie('token', '', { expires: new Date('1969-04-20') })
				res.sendStatus(401)
			}

			// End request
			res.end()
		} else {
			res.cookie('token', '', { expires: new Date('1969-04-20') })
			res.sendStatus(401)
			res.end()
		}
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	likedProfiles,
	dislikedProfiles,
	matches
};
