const fs = require('fs'),
	http = require('http'),
	https = require('https');

const app = require('./app');

if (process.env.NODE_ENV !== 'test') {
	let httpServer = http.createServer(app);
	let httpsServer = https.createServer(app);

	httpServer.listen(8080, () => console.log('http on port 8080'));
	httpsServer.listen(8443, () => console.log('https on port 8443'));

}

