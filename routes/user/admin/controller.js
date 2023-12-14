const bcrypt = require('bcrypt');
const Admin = require('../../../models/Admin');

const createToken = require('../../../utils/createToken');

const options = {
	expires: new Date(
		Date.now() + 7 * 24 * 60 * 60 * 1000
	),
	httpOnly: true,
};
exports.createAdmin = async (req, res, next) => {
	try {
		const { email, password, name } = req.body;
		const adminExists = await Admin.findOne({ email });
		if (adminExists) {
			return res.status(400).json({ ok: false, data: { errors: [{ msg: 'Email already exists' }] } });
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const admin = await Admin.create({ name, email, password: hashedPassword });
		const token = createToken(admin);
		res.cookie("token", token, options).status(200).json({ ok: true, data: { msg: "Admin Logged In", admin, token } });
		return res.status(200).json({ ok: true, data: { admin, token } });
	} catch (error) {
		next(error);
	}
}

exports.loginAdmin = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const admin = await Admin.findOne({ email });
		if (!admin) {
			return res.status(400).json({ errors: [{ msg: "Admin not found with this email" }] })
		}
		const passwordMatch = await bcrypt.compare(password, admin.password);
		if (!passwordMatch) {
			return res.status(400).json({ errors: [{ msg: "wrong username or password" }] })
		}
		const token = createToken(admin);
		res.cookie("token", token, options).status(200).json({ data: { msg: "Admin Logged In", admin, token } });
	} catch (error) {
		next(error);
	}
}