define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

// unused require
/*jslint unparam: true */
define(function (require) {
    "use strict";
    var Observer;

    /**
     * An object that can be observed.
     * Allows a caller to register an event or fire all registered events.
     * @constructor
     * @memberof window.Core
     */
    Observer = function (unused) {
        this._observers = [];
    };

    Observer.prototype =
    /** @lends window.Core.Observer.prototype */
    {
        // Keep prototype set from clobbering the constructor.
        constructor: Observer.prototype.constructor,

        /**
         * Array of observers
         */
        _observers: null,

        /**
         * Remove a function from our observer array.
         * @param {function} fn function to remove
         */
        remove: function (fn) {
            var iNdx;
            for (iNdx = 0; iNdx < this._observers.length; ++iNdx) {
                if (this._observers[iNdx] === fn) {
                    this._observers.splice(iNdx, 1);
                }
            }
        },

        /**
         * Fire all our observers
         */
        fire: function () {
            var iNdx;
            for (iNdx = 0; iNdx < this._observers.length; ++iNdx) {
                (this._observers[iNdx])();
            }
        },

        /**
         * Add an observer
         * @param {function} fn function to add
         */
        add: function (fn) {
            this._observers.push(fn);
        }
    };

    return Observer;
});