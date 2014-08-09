var request = require('request');
var Q = require('q');
var moment = require('moment');

var redditURL = 'http://www.reddit.com';
var echoJsURL = 'http://www.echojs.com';
var hackerNewsURL = 'http://hnify.herokuapp.com';

var stories = [];

function fetchRedditFeed(subreddit) {
    var deferred = Q.defer();
    var opts = {
        headers: {
            'User-Agent': 'thedigest/0.1 by connyay'
        }
    }
    request(redditURL + '/r/' + subreddit + '/hot.json?limit=1', opts, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(response.body);
            data.data.children.forEach(function(post) {
                if (post.data.stickied) {
                    return;
                }
                var data = post.data;
                stories.push({
                    'title': data.title,
                    'source': '/r/' + subreddit,
                    'time': moment(data.created_utc * 1000).fromNow(),
                    'time_utc': data.created_utc,
                    'link': data.url,
                    'comment_count': data.num_comments,
                    'comment_link': redditURL + data.permalink
                });
            });
            deferred.resolve();
        }
    });
    return deferred.promise;
};

function fetchEchoJsFeed() {
    var deferred = Q.defer();

    request(echoJsURL + '/api/getnews/top/1/1', function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(response.body);
            data.news.forEach(function(post) {
                stories.push({
                    'title': post.title,
                    'source': 'Echo JS',
                    'time': moment(post.ctime * 1000).fromNow(),
                    'time_utc': post.ctime,
                    'link': post.url,
                    'comment_count': post.comments,
                    'comment_link': echoJsURL + '/news/' + post.id
                });
            });
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function fetchHackerNewsFeed() {
    var deferred = Q.defer();
    request(hackerNewsURL + '/get/top?limit=2', function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(response.body);
            data.stories.forEach(function(post) {
                stories.push({
                    'title': post.title,
                    'source': 'HackerNews',
                    'time': post.published_time,
                    'time_utc': null,
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

var deferredList = [];
// Grab Reddit Feeds
['programming', 'technology', 'science', 'webdev', 'blackhat'].forEach(function(subreddit) {
    deferredList.push(fetchRedditFeed(subreddit));
});

// Grab EchoJS feed
deferredList.push(fetchEchoJsFeed());

// Grab HackerNews feed
deferredList.push(fetchHackerNewsFeed());

Q.all(deferredList).then(function() {
    console.log('retrieved all?');
    console.log(stories);
});
