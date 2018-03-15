var Promise = require('promise');

/**
 *
 * @param parameters
 * @constructor
 */
function Transform(parameters) {
    this.parameters = parameters || {};
    this.messages = [];
}

Transform.prototype.generate = function Transform_generate() {
    return new Promise(function(resolve) {
        this.setThreads();
        this.buildMessages();
        resolve(this.messages);
    }.bind(this));
};

Transform.prototype.buildMessages = function Transform_buildMessages() {
    return new Promise(function(resolve, reject){
        if (this.threads instanceof Array) {
            console.log(this.threads);
            this.threads.map(function(thread, index){
                var msg = this.parameters;
                msg.filter.threadId = +index;
                msg.supplier = thread.supplier;

                if (thread.hasOwnProperty('filters')) {
                    msg.filter = Object.assign(msg.filter, thread.filters);
                }

                this.messages.push(msg);
            }.bind(this));

        }
        resolve(this.parameters);
    }.bind(this));
};

Transform.prototype.setThreads = function Transform_setThreads() {
    this.threads = this.parameters.threads;
    delete this.parameters.threads;
};

module.exports = Transform;