const { Schema, model, Types } = require('mongoose');

const CommentSchema = new Schema({
	user: {
		_id: false,
		id: {
			ref: "user",
			type: Types.ObjectId,
			required: true
		},
		name: {
			ref: "user",
			type: String,
			required: true
		},
		email: {
			ref: "user",
			type: String,
			required: true
		}
	},
	videoId: {
		ref: "video",
		type: String,
		required: true
	},
	comment: {
		type: String,
		required: true
	}
});