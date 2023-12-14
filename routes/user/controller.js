const bcrypt = require('bcrypt');
const User = require('../../models/User');
const createToken = require('../../utils/createToken');

const options = {
	expires: new Date(
		Date.now() + 7 * 24 * 60 * 60 * 1000
	),
	httpOnly: true,
};

exports.createUser = async (req, res, next) => {
	try {
		const { email, password, name } = req.body;
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ ok: false, data: { errors: [{ msg: 'Email already exists' }] } });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = await User.create({ name, email, password: hashedPassword });
		const token = createToken(user);
		res.cookie("token", token, options).status(200).json({ ok: true, data: { msg: "User Logged In", user, token } });
		return res.status(200).json({ ok: true, data: { user, token } });
	} catch (error) {
		next(error);
	}
}

exports.loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ errors: [{ msg: "User not found with this email" }] })
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res.status(400).json({ errors: [{ msg: "wrong username or password" }] })
		}
		const token = createToken(user);
		res.cookie("token", token, options).status(200).json({ data: { msg: "User Logged In", user, token } });
	} catch (error) {
		next(error);
	}
}