const express = require('express'),
	multer = require('multer'),
	mongoose = require('mongoose'),
	path = require('path'),
	crypto = require('crypto'),
	config = require('../config');

const router = express.Router();

mongoose.connect(config.databaseUri, { 
	useNewUrlParser: true,
	useUnifiedTopology: true
})

let avatarStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../client/build/avatars/'))
	}, filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + '-' + crypto.randomBytes(10).toString('base64').replace(/\//g, '_').slice(0, 10))
	}
});

let pictureStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, '../client/build/pictures/'))
	}, filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now() + '-' + crypto.randomBytes(10).toString('base64').replace(/\//g, '_').slice(0, 10))
	}
})

let avatarUpload = multer({ storage: avatarStorage }),
	pictureUpload = multer({ storage: pictureStorage });

// Import controllers
const auth = require('../controllers/auth'),
	home = require('../controllers/home'),
	matches = require('../controllers/matches'),
	profile = require('../controllers/profile'),
	user = require('../controllers/user');

// Auth
router.post('/signup', auth.signUp)
router.post('/signup-details', avatarUpload.single('avatar'), auth.signUpDetails)
router.post('/signin', auth.signIn)

// Home
router.post('/home', home.getUser)
router.post('/home/tap', home.tapUser)

// Profile
router.post('/profile', profile.getProfileData)
router.post('/profile/change-avatar', avatarUpload.single('avatar'), profile.changeAvatar)
router.post('/profile/change-description', profile.changeDescription)
router.post('/profile/upload-pictures', pictureUpload.array('pictures'), profile.uploadPictures)
router.post('/profile/delete-picture', profile.deletePicture)
router.post('/profile/delete-account', profile.deleteAccount)

// Matches
router.post('/likes', matches.likedProfiles)
router.post('/dislikes', matches.dislikedProfiles)
router.post('/matches', matches.matches)

// User profile
router.post('/user', user.getUserData)

module.exports = router;
