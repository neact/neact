'use strict';

export default function CallbackQueue() {
    this.listeners = [];
}
CallbackQueue.prototype.enqueue = function(callback) {
    this.listeners.push(callback);
};

CallbackQueue.prototype.notifyAll = function() {
    const cbs = this.listeners;
    this.listeners = [];
    for (let i = 0; i < cbs.length; i++) {
        cbs[i]();
    }
};