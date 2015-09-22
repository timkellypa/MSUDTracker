
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

// unused require
/*jslint unparam: true */
define(function (require) {
    "use strict";
    var ObserverPair;

    /**
     * This is a class that couples an observer with its handler.
     * Also contains some convenience methods for cancelling the observer.
     * This is so that observers, even if added to dynamic or anonymous functions, can still be cancelled, using the
     * normal method of doing so.
     * @constructor
     * @memberof window.Core
     * @param {window.Core.Observer} observer
     * @param {Function} handler function that handles this observer
     */
    ObserverPair = function (observer, handler) {
        this.observer = observer;
        this.handler = handler;
    };

    ObserverPair.prototype =
    /** @lends window.Core.ObserverPair.prototype */
    {
        // Keep prototype set from clobbering the constructor.
        constructor: ObserverPair.prototype.constructor,

        /**
         * Observer
         * @type {window.Core.Observer}
         */
        observer: null,

        /**
         * Handler for this observer
         * @type {Function}
         */
        handler: null,

        register: function () {
            this.observer.add(this.handler);
        },

        cancel: function () {
            this.observer.remove(this.handler);
        },

        destroy: function () {
            this.cancel();
            this.observer = null;
            this.handler = null;
        }

    };

    return ObserverPair;
});