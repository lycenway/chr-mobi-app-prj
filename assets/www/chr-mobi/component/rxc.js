define(function(require) {
    var slice = [].slice;

    // Event
    var Event = function() {
        this.__subscribers = [];
    };

    Event.prototype = {
        subscribe: function(fn) {
            var subscribers = this.__subscribers;
            subscribers.push(fn);
            return function() {
                var i = subscribers.indexOf(fn);
                if (i !== -1) {
                    subscribers.splice(i, 1);
                }
            };
        },

        notify: function() {
            var args = arguments;
            slice.call(this.__subscribers).forEach(function(subscriber) {
                subscriber.apply(null, args);
            });
        }
    };

    // PreservedEvent
    var notify = Event.prototype.notify;
    var subscribe = Event.prototype.subscribe;

    var PreservedEvent = function() {
        Event.apply(this, arguments);
    };

    PreservedEvent.prototype = {
        notify: function() {
            this._lastArgs = arguments;
            return notify.apply(this, arguments);
        },
    
        subscribe: function(fn) {
            var dispose = subscribe.apply(this, arguments);
            if (this._lastArgs) {
                fn.apply(null, this._lastArgs);
            }
            return dispose;
        }
    };

    // Promise
    var Promise = function(resolvedResult, rejectedResult) {        
        this.resolvedResult = resolvedResult;
        this.rejectedResult = rejectedResult;
    };

    Promise.prototype = {
        then: function(success, fail) { 
            var nextResolvedResult = new PreservedEvent();
            var nextRejectedResult = new PreservedEvent();

            this.resolvedResult.subscribe(function() {
                if (typeof success === 'function') {
                    nextResolvedResult.notify(success.apply(null, arguments));
                } else {
                    nextResolvedResult.notify.apply(nextResolvedResult, arguments);
                }
            })
            this.rejectedResult.subscribe(function() {
                if (typeof fail === 'function') {
                    nextRejectedResult.notify(fail.apply(null, arguments));
                } else {
                    nextRejectedResult.notify.apply(nextResolvedResult, arguments);
                }
            })

            return new Promise(nextResolvedResult, nextRejectedResult)
        }
    };

    // Deferred
    var Deferred = function() {
        this.resolvedResult = new PreservedEvent();
        this.rejectedResult = new PreservedEvent();
        this.resolved = false;
        this.rejected = false;

        this.promiseObject = new Promise(this.resolvedResult, this.rejectedResult);
    };

    Deferred.prototype = {
        resolve: function() {
            if (this.rejected) {
                throw new Error('deferred has already been rejected');
            }

            if (!this.resolved) {
                this.resolved = true;
                this.resolvedResult.notify.apply(this.resolvedResult, arguments);
            }
        },

        reject: function() {
            if (this.resolved) {
                throw new Error('deferred has already been resolved');
            }

            if (!this.rejected) {
                this.rejected = true;
                this.rejectedResult.notify.apply(this.rejectedResult, arguments);
            }
        },

        promise: function() {
            return this.promiseObject;
        }
    };

    return Deferred;
})