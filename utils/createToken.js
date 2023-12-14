const jwt = require('jsonwebtoken');
const createToken = (user) => {
	const token = jwt.sign({ user }, 'MY_SECRET', { expiresIn: '7d' });
	return token;
};

module.exports = createToken;