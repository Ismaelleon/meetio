const request = require('supertest'),
	mongoose = require('mongoose');

const app = require('../src/app'),
	config = require('../src/config');

const User = require('../src/models/User');
const { getToken } = require('./helper');

jest.setTimeout(10000)

beforeAll(async () => {
	// Create test user
	const res = await request(app)
		.post('/api/signup')
		.set('Content-Type', 'application/json')
		.send({ name: 'test_user', password: 'test_password' });

	mongoose.connect(config.databaseUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
})

afterAll(async (done) => {
	try {
		// Delete all created users
		await User.deleteMany({});

		await mongoose.disconnect()
		done()
	} catch (error) {
		console.log(error)
	}
})

describe('/api/profile', () => {
	test('Should return the profile data', async () => {
		try {
			const token = await getToken('test_user', 'test_password');

			let res = await request(app)
				.post('/api/profile')
				.set('Content-Type', 'application/json')
				.set('Cookie', [`token=${token}`]);

			expect(res.body.name).toEqual('test_user')
			expect(res.body.pictures).toBeDefined()
			expect(res.body.verified).toEqual(false)
		} catch (error) {
			console.log(error)
		}
	})
})

describe('/api/profile/change-avatar', () => {
	test('Should change the avatar', async () => {
		try {
			const token = await getToken('test_user', 'test_password');

			let res = await request(app)
				.post('/api/profile/change-avatar')
				.set('Cookie', [`token=${token}`])
				.attach('avatar', 'tests/test-avatar.png');

			expect(res.body.avatar).not.toBe('avatar.png')
		} catch (error) {
			console.log(error)
		}
	})
})

describe('/api/profile/change-description', () => {
	test('Should edit the user description', async () => {
		try {
			const token = await getToken('test_user', 'test_password')

			const res = await request(app)
				.post('/api/profile/change-description')
				.set('Content-Type', 'application/json')
				.set('Cookie', [`token=${token}`])
				.send({ description: 'test_description' });

			let testUser = await User.findOne({ name: 'test_user' });
			expect(testUser.description).toEqual('test_description')
		} catch (error) {
			console.log(error)
		}
	})

})

describe('/api/profile/upload-pictures', () => {
	test('Should add a picture', async () => {
		try {
			const token = await getToken('test_user', 'test_password');

			let res = await request(app)
				.post('/api/profile/upload-pictures')
				.set('Cookie', [`token=${token}`])
				.attach('pictures', 'tests/test-avatar.png');
			
			expect(res.body).not.toBe([])
		} catch (error) {
			console.log(error)
		}
	})
})

describe('/api/profile/delete-picture', () => {
	test('Should delete a picture', async () => {
		try {
			const token = await getToken('test_user', 'test_password');
			const testUser = await User.findOne({ name: 'test_user' });

			let res = await request(app)
				.post('/api/profile/delete-picture')
				.set('Cookie', [`token=${token}`])
				.send({ pictureName: testUser.pictures[0] });
			
			expect(res.body).toEqual([])
		} catch (error) {
			console.log(error)
		}
	})
})

describe('/api/profile/delete-account', () => {
	test('Should delete the account', async () => {
		try {
			const token = await getToken('test_user', 'test_password');

			let res = await request(app)
				.post('/api/profile/delete-account')
				.set('Cookie', [`token=${token}`])
				.send({ password: 'test_password' });
			
			let testUser = await User.find({ name: 'test_user' });

			expect(testUser).toEqual([])
		} catch (error) {
			console.log(error)
		}
	})
})
