const mongoose = require('mongoose');
const { mongouri } = require('../config.json');

mongoose.connect(mongouri).catch(() => console.log('Unable to connect database'));
