'use strict';

var request = require('request');
var Q = require('q');
var moment = require('moment');

require('./db');
var Post = require('mongoose').model('Post');

var reddit = {
    url: 'http://www.reddit.com',
    limit: 100,
    uaString: 'thedigest/0.1 by connyay'
};
var echojs = {
    url: 'http://www.echojs.com',
    limit: 32
};
var hackernews = {
    url: 'http://hnify.herokuapp.com',
    limit: 90
};

var posts = [];

function fetchRedditFeed(subreddit) {
    var deferred = Q.defer();
    var opts = {
        headers: {
            'User-Agent': reddit.uaString
        }
    };
    request(reddit.url + '/r/' + subreddit + '/hot.json?limit=' + reddit.limit, opts, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            data.data.children.forEach(function(post) {
                if (post.data.stickied) {
                    return;
                }
                var data = post.data;
                posts.push({
                    'title': data.title,
                    'source': '/r/' + subreddit,
                    'time': moment(data.created_utc * 1000).fromNow(),
                    'link': data.url,
                    'comment_count': data.num_comments,
                    'comment_link': reddit.url + data.permalink
                });
            });
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function fetchEchoJsFeed(page) {
    var deferred = Q.defer();
    var start = (page === 1) ? 1 : 33;
    request(echojs.url + '/api/getnews/top/' + start + '/' + echojs.limit, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            data.news.forEach(function(post) {
                posts.push({
                    'title': post.title,
                    'source': 'Echo JS',
                    'time': moment(post.ctime * 1000).fromNow(),
                    'link': post.url,
                    'comment_count': post.comments,
                    'comment_link': echojs.url + '/news/' + post.id
                });
            });
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function fetchHackerNewsFeed() {
    var deferred = Q.defer();
    request(hackernews.url + '/get/top?limit=' + hackernews.limit, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            data.stories.forEach(function(post) {
                posts.push({
                    'title': post.title,
                    'source': 'HackerNews',
                    'time': post.published_time,
                    'link': post.link,
                    'comment_count': post.num_comments,
                    'comment_link': post.comments_link
                });
            });
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function sortAndStorePosts() {
    var sortedPosts = [],
        category,
        separatedPosts = {
            secondsAgo: [],
            minutesAgo: [],
            hoursAgo: [],
            daysAgo: [],
            weeksAgo: [],
            monthsAgo: [],
            yearsAgo: []
        };

    var categories = ['second', 'minute', 'hour', 'day', 'week', 'month', 'year'];
    var length = posts.length;
    for (var i = 0; i < length; i++) {
        var post = posts[i];
        var time = post.time;

        for (var ci = 0; ci < categories.length; ci++) {
            category = categories[ci];
            if (time.indexOf(category) !== -1) {
                separatedPosts[category + 'sAgo'].push(post);
            }
        }
    }
    var sort = function(a, b) {
        var aTime = a.time.match(/\d+/);
        var bTime = b.time.match(/\d+/);
        return parseInt(aTime === null ? 0 : aTime[0]) - parseInt(bTime === null ? 0 : bTime[0]);
    };
    for (category in separatedPosts) {
        separatedPosts[category].sort(sort);
    }


    posts = sortedPosts.concat(separatedPosts.secondsAgo, separatedPosts.minutesAgo, separatedPosts.hoursAgo,
        separatedPosts.daysAgo, separatedPosts.weeksAgo, separatedPosts.monthsAgo,
        separatedPosts.yearsAgo);
}

var deferredList = [];
// Grab Reddit Feeds
['programming', 'technology', 'science', 'webdev', 'blackhat'].forEach(function(subreddit) {
    deferredList.push(fetchRedditFeed(subreddit));
});

// Grab EchoJS feed
// Page 1
deferredList.push(fetchEchoJsFeed(1));
// Page 2
deferredList.push(fetchEchoJsFeed(2));

// Grab HackerNews feed
deferredList.push(fetchHackerNewsFeed());

Q.all(deferredList).then(function() {
    sortAndStorePosts();
    // Wipe out DB
    Post.collection.remove({}, function(err) {
        if (!err) {
            console.log('Collection dropped.');
        } else {
            console.log('Error dropping collection?');
        }
    });
    Post.collection.insert(posts, function(err, docs) {
        if (!err) {
            console.log('Collection saved! Stored ' + docs.length + ' posts in the DB.');
        } else {
            console.log('Error saving docs?');
        }
    });
});
