# Meetio
Start a relationship. Meet people.

Meetio is a dating web app where people can sign up and
start using it. It is like a [Tinder](https://tinder.com) clone made with React and Node.js.

## Getting Started
Follow these instructions to get this project running on your machine.

### Prerequisites
 - [Node.js](https://nodejs.org)
 - [MongoDB](https://mongodb.com)

### Installation
1. Clone this repo
```sh
git clone https://github.com/Ismaelleon/meetio
```

2. Install NPM packages
```sh
cd meetio/server/
npm install
cd src/client/
npm install
```

3. Create a `config.js` file in 'server/'
```js
module.exports = {
	databaseUri: 'your-database-uri',
	secret: 'your_secret'
};
```

4. Create pictures directory and build client
```sh
cd meetio/server/src/client/build
mkdir pictures
npm run build
```

5. Run server
```sh
cd meetio/server
npm start
```

### License
Distributed under the GNU LGPLv3 License. See `LICENSE` for more information.
