[dgst.it](http://dgst.it)
=========


### What is this?
This is a news aggregator... aggregator. I built this for my own use, but I figured others might enjoy it as well.

### What does it do?
[dgst.it](http://dgst.it) scans Reddit (7 subreddits), Hacker News, Echo JS, and Hack A day every hour and caches the results.

### Why?
Why not?


### What tech is under the covers?
1. Node.js (Express)
2. MongoDB
3. Memcached

### What is the design?
Design is [lanyon](https://github.com/poole/lanyon) by the very talented [mdo](https://github.com/mdo).

#### Local dev setup
*Prerequisites:*
- node & npm available on path
- mongodb and memcached running

*Steps:*

1. `git clone git@github.com:connyay/dgst-it.git`
2. `cd dgst-it`
3. `npm install`
4. `./digest`
5. `npm start`


#### Host your own on Heroku!
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/connyay/dgst-it)

***Note:*** This will deploy the application and run the `./digest` script once. Edit the scheduler addon to run `./digest` hourly.