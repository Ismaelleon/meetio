const request = require('supertest'),
	mongoose = require('mongoose');

require('dotenv').config();

const app = require('../src/app');

const User = require('../src/models/User');
const { getToken } = require('./helper');

jest.setTimeout(30000)

beforeAll(async () => {
	mongoose.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})

	// Create test user
	await request(app)
		.post('/api/signup')
		.set('Content-Type', 'application/json')
		.send({ name: 'test_user', password: 'test_password' });
	
	// Create another user to get its data
	await request(app)
		.post('/api/signup')
		.set('Content-Type', 'application/json')
		.send({ name: 'another_test_user', password: 'another_test_password' });
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

describe('/api/home', () => {
	test('Should return data from a user', async () => {
		try {
			const token = await getToken('test_user', 'test_password');

			const res = await request(app)
				.post('/api/home')
				.set('Content-Type', 'application/json')
				.set('Cookie', [`token=${token}`]);

			expect(res.body.name).toEqual('another_test_user')
			expect(res.body.pictures).toBeDefined()
			expect(res.body.verified).toEqual(false)
		} catch (error) {
			console.log(error)
		}
	})
})

describe('/api/home/tap', () => {
	test('Should add the user to alreadyTappedUsers', async () => {
		try {
			const token = await getToken('test_user', 'test_password');

			const res = await request(app)
				.post('/api/home/tap')
				.set('Content-Type', 'application/json')
				.set('Cookie', `token=${token}`)
				.send({ like: true, name: 'another_test_user' });
			
			const testUser = await User.findOne({ name: 'test_user' });

			expect(testUser.alreadyTappedUsers[0].name).toEqual('another_test_user')
			expect(testUser.alreadyTappedUsers[0].like).toEqual(true)
		} catch (error) {
			console.log(error)
		}
	})
})
