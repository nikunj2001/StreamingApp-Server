const { Schema, model, Types } = require('mongoose');

const VideoSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	subTitle: {
		type: String, 
		required: true
	},
	videoLink: {
		type: String, 
		required: true
	},
	secretToken: {
		type: String,
		required: true
	},
	uploadedBy: {
		ref: "admin",
		type: Types.ObjectId,
		required: true
	}
},{ timestamps: true });

module.exports = model('video', VideoSchema);
