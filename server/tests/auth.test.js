const request = require('supertest'),
	mongoose = require('mongoose');

const app = require('../src/app'),
	config = require('../src/config');

const User = require('../src/models/User');
const { setToken, getToken } = require('./helper');

jest.setTimeout(5000)

async function deleteTestUser () {
	await User.deleteOne({ name: 'test_user' })
}

beforeAll(() => {
	mongoose.connect(config.databaseUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
})

afterAll(async () => {
	try {
		await deleteTestUser()
		await mongoose.disconnect()
	} catch (error) {
		console.log(error)
	}
})

describe('/api/signup', () => {
	test('Should return a 200 status code', async () => {
		try {
			const res = await request(app)
				.post('/api/signup')
				.set('Content-Type', 'application/json')
				.send({ name: 'test_user', password: 'test_password' });

			expect(res.status).toEqual(200)
			deleteTestUser()
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
			setToken(res.headers['set-cookie'][0].slice(6))
		} catch (error) {
			console.log(error)
		}
	})

	test('Should create a new user', async () => {
		try {
			let user = await User.findOne({ name: 'test_user' });
			expect(user).not.toBe(null)
		} catch (error) {
			console.log(error)
		}
	})

	test('Should return a 409 status code', async () => {
		try {
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
	test('Should return a 200 status code', async () => {
		try {
			const res = await request(app)
				.post('/api/signup-details')
				.set('Cookie', [`token=${getToken()}`])
				.field('description', 'Hey')
				.attach('avatar', 'tests/test-avatar.png');

			expect(res.status).toEqual(200)

		} catch (error) {
			console.log(error)
		}
	})

	test('Should edit the user description', async () => {
		try {
			let user = await User.findOne({ name: 'test_user' });
			expect(user.description).toEqual('Hey')
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
