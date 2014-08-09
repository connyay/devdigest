var mongoose = require('mongoose');

var mongoDbURL = "mongodb://localhost/thedigest";
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    mongoDbURL = env.mongolab[0].credentials.uri;
}

mongoose.connect(mongoDbURL);
