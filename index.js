const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const  DB  = require('./utils/DB/index');
const PORT = 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: Get these from config file
DB.connect('mongodb://127.0.0.1:27017/', 'video-player-local');

require('./routes')(app);

app.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`)
})