const request = require('supertest'),
	mongoose = require('mongoose');

require('dotenv').config();

const app = require('../src/app');

const User = require('../src/models/User');
const { getToken } = require('./helper');

jest.setTimeout(30000)

beforeAll(async () => {
	// Create test user
	const res = await request(app)
		.post('/api/signup')
		.set('Content-Type', 'application/json')
		.send({ name: 'test_user', password: 'test_password' });

	mongoose.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
})

afterAll(async () => {
	try {
		// Delete all created users
		await User.deleteMany({});

		await mongoose.disconnect()
	} catch (error) {
		console.log(error)
	}
})

describe('/api/user', () => {
	test('Should return the user data', async () => {
		try {
			const token = await getToken('test_user', 'test_password');

			let res = await request(app)
				.post('/api/user')
				.set('Content-Type', 'application/json')
				.set('Cookie', [`token=${token}`])
				.send({ name: 'test_user' });
			
			expect(res.body.name).toEqual('test_user')
		} catch (error) {
			console.log(error)
		}
	})
})

