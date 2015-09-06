define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var _ = require("underscore"),
        moment = require("moment"),
        MILLISECONDS_PER_DAY = 86400000, // (1000 * 60 * 60 * 24)
        Utils;

    /**
     * General utility functions for the application.
     * @memberof window.Lib.Local
     * @namespace
     */
    Utils =
    /** @lends window.Lib.Local.Utils */
    {
        /**
         * Simulate classical inheritance, by creating a class that
         * <br />1. extends a parent
         * <br />2. is an instanceof both the child and parent.
         * <br />3. includes a static $Super, which allows direct access to the parent prototype.
         * <br />4. includes any static methods (methods attached directly to the parent object, not the prototype).
         * @param {Object} child child class.
         * @param {Object} parent parent class.
         */
        inherit: function (child, parent) {
            var childCtor = child.prototype.constructor,
                Tmp;

            Tmp = function () {
                return this;
            };
            Tmp.prototype = parent.prototype;

            child.prototype = _.extend(new Tmp(), child.prototype);
            child.prototype.constructor = childCtor;
            child.$Super = parent.prototype;
        },

        /**
         * Get Number of days since Epoch
         * @param {int} time (result of Date.prototype.getTime())
         * @return {int} full days contained in the Javascript time.
         */
        getEpochDayFromTime: function (time) {
            var curDT = new Date(time);
            return (parseInt((time - (curDT.getTimezoneOffset() * 60 * 1000)) / MILLISECONDS_PER_DAY, 10));
        },

        /**
         * Get Number of days since Epoch
         * @param {int} day days contained in the Javascript time.
         * @return {int} time (result of Date.prototype.getTime())
         */
        getTimeFromEpochDay: function (day) {
            var time = day * MILLISECONDS_PER_DAY;
            return time + (new Date(time)).getTimezoneOffset() * 60 * 1000;
        },

        /**
         * Full Date Format.  Done in a central location, so it could be changed by altering the locale.
         * @param {Date} date date object to format.
         * @return {string} date formatted.
         */
        fullDateFormat: function (date) {
            return moment(date).format("dddd, MMM DD, YYYY");
        },

        /**
         * Get the promise library
         * @returns {object} promise library
         */
        getPromiseLib: function () {
          return require("rsvp");
        },

        /**
         * Get a normal promise object.
         * @param {Function} method promise method.  Takes a success and failure function param.
         * @param {string} [label] optional promise label.
         * @returns {object} deferred promise
         */
        createPromise: function (method, label) {
            var lib = this.getPromiseLib();
            return new lib.Promise(method, label);
        }
    };
    return Utils;
});