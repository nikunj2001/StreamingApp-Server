const { Schema, model } = require('mongoose');

const AdminSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String, 
		required: true
	},
	password: {
		type: String, 
		required: true
	},
	videos: [{type: String}]
	
},{ timestamps: true });

module.exports = model('admin', AdminSchema);
