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
            /** Path to jQuery.  Pick between minified and non-minified */
            jquery: "Lib/Vendor/jQuery/jquery-2.1.3",
            /** Path to moment.  Pick between minified and non-minified */
            moment: "Lib/Vendor/Moment/Moment",
            /** Path to underscore.  Pick between minified and non-minified */
            underscore: "Lib/Vendor/Underscore/Underscore",
            /** Path to RSVP.  Pick between minified and non-minified */
            rsvp: "Lib/Vendor/RSVP/RSVP",
            /** Path to RSVP.  Pick between minified and non-minified */
            pathjs: "Lib/Vendor/PathJS/Path-0.8.4",

            /**
             * Text Require.js plugin
             * Note that we are using an extended version that also supports "head"
             * to just get the header content.
             */
            text: "Lib/Vendor/Require/Plugins/TextEx",

            /** DomReady Require.js plugin **/
            domReady: "Lib/Vendor/Require/Plugins/DomReady",

            /** Run tests instead of launching the app? */
            test: false,

            /** Name of the database */
            databaseName: "__MSUD__",

            /** Whether or not to load fake data sets for testing */
            loadTestData: true
        }
    };
    return Config;
});