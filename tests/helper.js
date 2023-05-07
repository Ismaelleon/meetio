const request = require('supertest');
const app = require('../src/app');

const User = require('../src/models/User');

async function deleteTestUser (name) {
	try {
		await User.deleteOne({ name });
	} catch (error) {
		console.log(error)
	}
}

async function getToken (name, password) {
	try {
		const res = await request(app)
			.post('/api/signin')
			.send({ name, password });
		
		return res.headers['set-cookie'][0].split(';')[0].slice(6)
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	deleteTestUser,
	getToken
};
