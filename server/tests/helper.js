let authToken;

function setToken(newValue) {
	authToken = newValue;
}

function getToken () {
	return authToken
}

module.exports = {
	setToken,
	getToken
};
