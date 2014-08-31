'use strict';
var express = require('express');
var compression = require('compression');
// mongoose setup
require('./db');
var Post = require('mongoose').model('Post');

var app = express();
app.use(compression());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 5000));


app.get('/', function(req, res, next) {

    Post.find()
        .sort({
            '_id': 1
        })
        .exec(function(err, posts) {
            if (err) {
                return next(err);
            }
            res.render('index', {
                posts: posts
            });
        });

});

// Start it up
app.listen(app.get('port'), function() {
    console.log('Node app is listening on port: ' + app.get('port'));
});
