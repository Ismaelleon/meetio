const express = require('express'),
    bodyParser = require('body-parser'),
    routes = require('./routes/router'),
    cookieParser = require('cookie-parser'),
    path = require('path');

const app = express();

// middlewares
app.use(express.static(path.join(__dirname, 'client/build')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use('/api', routes)

let port = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
		console.log(`app running on port ${port}`)
  })
}

module.exports = app;
