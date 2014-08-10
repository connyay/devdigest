'use strict';
var Post = require('mongoose').model('Post');

exports.index = function(req, res, next) {
    Post.find()
        .sort({
            '_id': 1
        })
        .exec(function(err, posts) {
            if (err) {
                return next(err);
            }
            res.json(posts);
        });
};
