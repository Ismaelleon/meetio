const request = require('supertest'),
	mongoose = require('mongoose');

const app = require('../src/app'),
	config = require('../src/config');

const User = require('../src/models/User');
const { deleteTestUser, getToken } = require('./helper');

jest.setTimeout(10000)

beforeAll(async () => {
	mongoose.connect(config.databaseUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})

	await User.deleteOne({ name: 'test_user' });
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

describe('/api/signup', () => {
	afterEach(() => deleteTestUser('test_user'))

	test('Should return a 200 status code', async () => {
		try {
			const res = await request(app)
				.post('/api/signup')
				.set('Content-Type', 'application/json')
				.send({ name: 'test_user', password: 'test_password' });
			
			expect(res.status).toEqual(200)
		} catch (error) {
			console.log(error)
		}
	})

	test('Should return a token', async () => {
		try {
			const res = await request(app)
				.post('/api/signup')
				.set('Content-Type', 'application/json')
				.send({ name: 'test_user', password: 'test_password' });
			
			expect(res.headers['set-cookie'][0]).toMatch('token');
		} catch (error) {
			console.log(error)
		}
	})

	test('Should create a new user', async () => {
		try {
			const res = await request(app)
				.post('/api/signup')
				.set('Content-Type', 'application/json')
				.send({ name: 'test_user', password: 'test_password' });

			let testUser = await User.findOne({ name: 'test_user' });
			expect(testUser).not.toBe(null)
		} catch (error) {
			console.log(error)
		}
	})

	test('Should return a 409 status code', async () => {
		try {
			await request(app)
				.post('/api/signup')
				.set('Content-Type', 'application/json')
				.send({ name: 'test_user', password: 'test_password' });

			const res = await request(app)
				.post('/api/signup')
				.set('Content-Type', 'application/json')
				.send({ name: 'test_user', password: 'test_password' });

			expect(res.status).toEqual(409)
		} catch (error) {
			console.log(error)
		}
	})
})

describe('/api/signup-details', () => {
	beforeAll(async () => {
		await request(app)
			.post('/api/signup')
			.set('Content-Type', 'application/json')
			.send({ name: 'test_user', password: 'test_password' });
	})

	test('Should return a 200 status code', async () => {
		try {
			const token = await getToken('test_user', 'test_password');

			const res = await request(app)
				.post('/api/signup-details')
				.set('Cookie', [`token=${token}`])
				.field('description', 'Hey')
				.attach('avatar', 'tests/test-avatar.png');

			expect(res.status).toEqual(200)
		} catch (error) {
			console.log(error)
		}
	})
})

describe('/api/signin', () => {
	test('Should return a 200 status code', async () => {
		const res = await request(app)
			.post('/api/signin')
			.send({ name: 'test_user', password: 'test_password' })

		expect(res.status).toEqual(200)
	})

	test('Should return a token', async () => {
		const res = await request(app)
			.post('/api/signin')
			.send({ name: 'test_user', password: 'test_password' });

		expect(res.headers['set-cookie'][0]).toMatch('token');
	})
})
