define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/**
 * Standardizing a format for errors that are thrown by the app.
 */
define(function (require) {
    "use strict";
    var _ = require("underscore"),
        ErrorObj;

    /**
     * Standard error object for this application.
     * Contains some extra stuff, like an error code.
     * @constructor
     * @memberof window.Core
     * @param {window.Core.ErrorObj.Codes} code error code
     * @param {string} message error message
     * @param {Error} [innerException = null] actual exception thrown.
     */
    ErrorObj = function (code, message, innerException) {
        this.code = code;
        this.message = message;
        this.innerException = innerException !== undefined ? innerException : null;
    };

    _.extend(ErrorObj,
        /** @lends window.Core.ErrorObj */
        {
            /**
             * Enumerable list of codes
             * @memberof Core.ErrorObj
             * @type Object
             * @namespace
             */
            Codes: {
                /** General Exception */
                General: 0,
                /** Database Exception */
                DatabaseException: 1000,
                /** Unimplemented Exception */
                UnImplementedException: 2000,
                /** Uninitialized Object Exception */
                UnInitializedObjectException: 2001,
                /** Unhandled Exception */
                UnhandledException: 9999
            }
        });

    ErrorObj.prototype =
    /** @lends window.Core.ErrorObj.prototype */
    {
        constructor: Error.prototype.constructor,

        /**
         * Code defining the type of error.
         * @type window.Core.ErrorObj.Codes
         */
        code: null,

        /**
         * Message for the error
         * @type string
         */
        message: null,

        /**
         * An inner exception object (native JS error object)
         * @type Error
         */
        innerException: null
    };
    return ErrorObj;
});