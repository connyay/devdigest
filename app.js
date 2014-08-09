var express = require('express');
// mongoose setup
require('./db');

// setup middleware
var app = express();
app.set('port', (process.env.PORT || 5000));

// Start it up
app.listen(app.get('port'), function() {
    console.log("Node app is listening on port: " + app.get('port'));
});
