const mongoose = require('mongoose');

class DB {

	async connect(uri, dbName) {
		mongoose.connect(uri, { dbName }).then(() => {
			console.log(`Connected to MongoDB`, { uri, dbName });
		}).catch((error) => {
			console.log('Failed to connect to MongoDB', error, { uri, dbName });
		});
	}
}

module.exports = new DB();