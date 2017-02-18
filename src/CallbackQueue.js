'use strict';

export default function CallbackQueue() {
    this.listeners = [];
}
CallbackQueue.prototype.enqueue = function(callback) {
    this.listeners.push(callback);
};

CallbackQueue.prototype.notifyAll = function() {
    for (let i = 0; i < this.listeners.length; i++) {
        this.listeners[i]();
    }
    this.listeners.length = 0;
};