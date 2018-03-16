var Promise = require('promise');
var Http = require("../persistence/http");
/**
 *
 * @param parameters
 * @param urlSearch
 * @param urlFinish
 * @constructor
 */
function Process(parameters, urlSearch, urlFinish) {
    this.parameters = parameters || {};
    this.messages = [];
    this.urlSearch = urlSearch || null;
    this.urlFinish = urlFinish || null;
}

Process.prototype.run = function Process_run() {
    return new Promise(function(resolve) {
        this.setThreads();
        this.buildMessages()
            .then(function(searchId){
                //Make a request
                var options = {
                    uri: this.urlFinish,
                    method: "POST",
                    json: {'searchID': searchId},
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                Http.request(options);
            }.bind(this));
        resolve(this.messages);
    }.bind(this));
};

Process.prototype.buildMessages = function Process_buildMessages() {
    return new Promise(function(resolve, reject){
        if (this.threads instanceof Array) {
            this.threads.map(function(thread, index) {
                var msg = this.parameters;
                msg.filter.threadId = +index;
                msg.supplier = thread.supplier;

                if (thread.hasOwnProperty('filters')) {
                    msg.filter = Object.assign(msg.filter, thread.filters);
                }

                //Make a request
                var timeout = msg.timeout;
                var options = {
                    uri: this.urlSearch,
                    method: "POST",
                    json: msg,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                Http.request(options, timeout);
            }.bind(this));

            resolve(this.parameters.searchId);
        }
    }.bind(this));
};

Process.prototype.setThreads = function Process_setThreads() {
    this.threads = this.parameters.threads;
    delete this.parameters.threads;
};

module.exports = Process;