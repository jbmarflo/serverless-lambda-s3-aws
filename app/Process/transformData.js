var Promise = require('promise');
var Http = require("../persistence/http");
/**
 *
 * @param parameters
 * @constructor
 */
function Transform(parameters) {
    this.parameters = parameters || {};
    this.messages = [];
}

Transform.prototype.run = function Transform_run() {
    return new Promise(function(resolve) {
        this.setThreads();
        this.buildMessages()
            .then(function(searchId){
                console.log('Delete search by: ' + searchId);
            });
        resolve(this.messages);
    }.bind(this));
};

Transform.prototype.buildMessages = function Transform_buildMessages() {
    return new Promise(function(resolve, reject){
        if (this.threads instanceof Array) {
            this.threads.map(function(thread, index) {
                var msg = this.parameters;
                msg.filter.threadId = +index;
                msg.supplier = thread.supplier;

                if (thread.hasOwnProperty('filters')) {
                    msg.filter = Object.assign(msg.filter, thread.filters);
                }

                // var timeout_function = function(req) {
                //     return function() {
                //         req.abort();
                //     };
                // };
                var timeout = msg.timeout;
                var data = JSON.stringify(msg);
                var options = {
                    host: "hookb.in",
                    port: 443,
                    path: "/KNRRO573",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(data)
                    }
                };

                Http.request(options, data, timeout);
                // var req = https.request(options, function (res) {
                //     var response = "";
                //
                //     res.setEncoding("utf8");
                //
                //     res.on("data", function (chunk) {
                //         response += chunk;
                //     });
                //
                //     res.on("end", function () {
                //         console.log(response);
                //     });
                // });
                // req.write(data);
                // var fn = timeout_function(req);
                //
                //
                // var execTimeout = setTimeout( fn, timeout * 1000 );

                // req.end();
            }.bind(this));

            resolve(this.parameters.searchId);
        }
    }.bind(this));
};

Transform.prototype.setThreads = function Transform_setThreads() {
    this.threads = this.parameters.threads;
    delete this.parameters.threads;
};

module.exports = Transform;