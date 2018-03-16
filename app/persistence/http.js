var Promise = require('promise');
var request = require('request');

const TIME_TO_SECONDS = 1000;

var requestHttp = {
    'timeout': function(req) {
        return function() {
            req.abort();
        };
    },
    'request': function(options, timeout) {
        return new Promise(function(resolve, reject) {
            var req = request(options, function (error, response, body) {
                if (error) {
                    console.log('Can\'t process the request with options: ' + JSON.stringify(options));
                }
            });
            if (timeout != null && timeout) {
                setTimeout( this.timeout(req), timeout * TIME_TO_SECONDS );
            }
        }.bind(this));
    }
};

exports.request=requestHttp.request;