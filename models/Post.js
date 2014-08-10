'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.model('Post', new Schema({
    'title': String,
    'source': String,
    'time': String,
    'link': String,
    'comment_count': Number,
    'comment_link': String
}));
