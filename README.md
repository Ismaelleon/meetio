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

3. Create a config file in 'server/src'
```js
module.exports = {
	databaseUri: 'your-database-uri',
	secret: 'your_secret'
};
```

4. Start the development servers
```sh
cd meetio/server
npm run dev 
cd meetio/server/src/client/
npm run dev
```

### License
Distributed under the GNU LGPLv3 License. See `LICENSE` for more information.
