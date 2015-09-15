define([], function () {
    "use strict";
    var Config;
    /**
     * Configuration constants
     * @namespace
     * @memberof window
     */
    Config =
    /** @lends window.Config */
    {
        /**
         * Global variables for the app
         * @memberof window.Config
         * @type Object
         * @namespace
         */
        Globals: {
            /** Name of the database */
            databaseName: "__MSUD__",

            /** Whether or not to load fake data sets for testing */
            loadTestData: true,

            /**
             * Order of our preferred database methods.
             * We will end up choosing whichever is first
             */
            preferredDBs: ["sqlite", "indexeddb", "websql"]
        }
    };
    return Config;
});