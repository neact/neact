'use strict';

exports.__esModule = true;
exports['default'] = CallbackQueue;
function CallbackQueue() {
    this.listeners = [];
}
CallbackQueue.prototype.enqueue = function (callback) {
    this.listeners.push(callback);
};

CallbackQueue.prototype.notifyAll = function () {
    for (var i = 0; i < this.listeners.length; i++) {
        this.listeners[i]();
    }
    this.listeners.length = 0;
};