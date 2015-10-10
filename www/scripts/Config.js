/**
 * Configuration constants
 * @type {Object}
 * @namespace
 * @property {Object} Globals global variables for the app
 * @property {string} Globals.databaseName name of the database
 * @property {string} Globals.loadTestData whether or not to load fake data sets for testing
 * @property {Array} Globals.preferredDBs Order of preference of our preferred database methods.
 * App will choose first available.  Options are sqlite, indexeddb, and websql.
 */
let Config =
{
    Globals: {
        databaseName: "__MSUD__",
        loadTestData: true,
        preferredDBs: ["sqlite", "indexeddb", "websql"]
    }
};

export default Config;