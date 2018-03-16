var https = require("https");
var Promise = require('promise');

const TIME_TO_SECONDS = 1000;

var requestHttp = {
    'timeout': function(req) {
        return function() {
            req.abort();
        };
    },
    'request': function(options, data, timeout) {
        return new Promise(function(resolve, reject) {
            var req = https.request(options, function (res) {
                var response = "";

                res.setEncoding("utf8");

                res.on("data", function (chunk) {
                    response += chunk;
                });

            });
            req.write(data);
            if (timeout) {
                setTimeout( this.timeout(req), timeout * TIME_TO_SECONDS );
            }
            req.end();
        }.bind(this));
    }
};

exports.request=requestHttp.request;