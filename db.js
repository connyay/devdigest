'use strict';

var mongoose = require('mongoose');
require('./models/Post');

var mongoDbURL = 'mongodb://localhost/thedigest';
if (process.env.MONGOHQ_URL) {
    mongoDbURL = process.env.MONGOHQ_URL;
}

mongoose.connect(mongoDbURL);
