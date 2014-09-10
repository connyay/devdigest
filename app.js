'use strict';
var express = require('express');
var compression = require('compression');
// mongoose setup
require('./db');
var Post = require('mongoose').model('Post');

var client = require('./cache').client;

var app = express();
app.use(compression());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
var ip = process.env.IP || 'localhost';

var env = process.env.NODE_ENV || 'development';
if ('production' === env) {
    ip = process.env.OPENSHIFT_NODEDIY_IP || ip;
    port = process.env.OPENSHIFT_NODEDIY_PORT || port;
}

app.set('port', port);
app.set('ip', ip);

function getPosts(cb) {
    client.get('posts', function(err, posts) {
        if (posts) {
            // Cache hit :]
            cb(JSON.parse(posts.toString()));
            return;
        }
        // Cache miss :[
        Post.find()
            .sort({
                '_id': 1
            })
            .exec(function(err, posts) {
                if (err) {
                    return next(err);
                }
                client.set('posts', JSON.stringify(posts));
                cb(posts);
            });
    });
}

// Catch all paths for now...
app.get('*', function(req, res, next) {
    getPosts(function(posts) {
        res.render('index', {
            posts: posts
        });
    });
});

// Start it up
app.listen(app.get('ip'), app.get('port'), function() {
    console.log('Node app is listening on port: ' + app.get('port'));
});
