/**
 * @typedef window.Core.Callback
 * @name window.Core.Callback
 * @ignore
 */


define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

// not using require
/*jslint unparam: true */
define(function (require) {
    "use strict";
    var Callback;

    /**
     * Callback object, contains success and error methods. Passing no or null
     * arguments results in no-op functions.
     *
     * @constructor
     * @memberof window.Core
     * @param {function} [fnSuccess = function(){}] success method
     * @param {function} [fnError = function(){}] error method
     */
    Callback = function (fnSuccess, fnError) {
        this.success = fnSuccess || function () {
                return true;
            };
        this.error = fnError || function () {
                return true;
            };
    };

    Callback.prototype =
    /** @lends window.Core.Callback.prototype */
    {
        constructor: Callback.prototype.constructor,

        /**
         * success method
         *
         * @type function
         */
        success: null,

        /**
         * error method
         *
         * @type function
         */
        error: null
    };

    return Callback;
});