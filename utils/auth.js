const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async (req, res, next) => {
	const  token  = req.headers.authorization;
	if (!token) {
        return res.status(401).json({ data: { msg: "Please Login First" } });
    }
	try {
		const data = await jwt.verify(token, 'MY_SECRET');
		const { user } = data;
		const userExists = await User.findById(user._id);
		if (!userExists) {
			return res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true
            }).status(400).json({ data: { msg: "Login Again.Not Valid Token" } });
		}
		req.user = user;
		next();
	} catch (error) {
		res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        return res.status(401).json({ data: { msg: error.message } });
	}
}