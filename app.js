'use strict';
var express = require('express');
var compression = require('compression');
// mongoose setup
require('./db');

var api = {
    post: require('./api/post')
};

var app = express();
app.use(compression());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));

app.get('/posts', api.post.index);
app.get('/', function(req, res, next) {
    res.render('index');
});

// Start it up
app.listen(app.get('port'), function() {
    console.log("Node app is listening on port: " + app.get('port'));
});
