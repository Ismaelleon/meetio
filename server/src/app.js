const express = require('express'),
	fs = require('fs'),
    bodyParser = require('body-parser'),
    routes = require('./routes/router'),
    cookieParser = require('cookie-parser'),
    path = require('path');

const key = fs.readFileSync(path.join(__dirname, 'sslcert/privkey.pem'));
const cert = fs.readFileSync(path.join(__dirname, 'sslcert/cert.pem'));
const credentials = { key, cert };

const app = express(credentials);

// middlewares
app.use(express.static(path.join(__dirname, 'client/build')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/api', routes)

module.exports = app;
