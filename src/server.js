require('dotenv').config();

const fs = require('fs'),
	http = require('http'),
	https = require('https');

const app = require('./app');

if (process.env.NODE_ENV !== 'test') {
	let httpServer = http.createServer(app);

	const port = process.env.PORT || 8443;

	httpServer.listen(port, () => console.log(`meetio running on port ${port}`));
}

