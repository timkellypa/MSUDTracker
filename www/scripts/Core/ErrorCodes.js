/**
 * Standard enumerable list of error codes that can be used in an ErrorObj when throwing an error.
 * @type {Object}
 * @namespace
 * @property {number} General 0
 * @property {number} DatabaseException 1000
 * @property {number} UnImplementedException 2000
 * @property {number} UnInitializedObjectException 2001
 * @property {number} UnhandledException 9999
 */
let ErrorCodes =
{
    General: 0,

    DatabaseException: 1000,

    UnImplementedException: 2000,

    UnInitializedObjectException: 2001,

    UnhandledException: 9999
};

export default ErrorCodes;