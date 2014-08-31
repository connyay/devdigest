'use strict';

var memjs = require('memjs');

if(process.env.MEMCACHEDCLOUD_SERVERS) {
    exports.client = memjs.Client.create(process.env.MEMCACHEDCLOUD_SERVERS, {
      username: process.env.MEMCACHEDCLOUD_USERNAME,
      password: process.env.MEMCACHEDCLOUD_PASSWORD
    });
} else {
    exports.client = memjs.Client.create('127.0.0.1:11211');
}
