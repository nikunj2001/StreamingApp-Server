const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
module.exports = async (req, res, next) => {
	const  token  = req.headers.authorization;
	if (!token) {
        return res.status(401).json({ data: { msg: "Please Login First" } });
    }
	const authToken = token.split(' ')[1];
	try {
		const data = await jwt.verify(authToken, 'MY_SECRET');
		const { user } = data;
		const adminExists = await Admin.findById(user._id);
		if (!adminExists) {
			return res.cookie("token", null, {
                expires: new Date(Date.now()),
                httpOnly: true
            }).status(400).json({ data: { msg: "Login Again. Not Valid Token" } });
		}
		req.admin = user;
		next();
	} catch (error) {
		res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        return res.status(401).json({ data: { msg: error.message } });
	}
}