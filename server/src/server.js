const app = require('./app');

let port = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => {
		console.log(`app running on port ${port}`)
	})
}

