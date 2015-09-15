/*global window */
(function () {
    "use strict";

    var isTest = window !== undefined && window.__karma__ !== undefined;

    require.config({
        es6: {
            resolveModuleSource: function (source) {
                return 'es6!' + source;
            }
        },
        baseUrl: isTest ? "http://localhost:9876/base/www/scripts" : "scripts",
        paths: {
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

            /** Path to indexeddbshim.  Pick between minified and non-minified */
            indexeddbshim: "Lib/Vendor/IndexedDBShim/indexeddbshim",

            /**
             * Text Require.js plugin
             * Note that we are using an extended version that also supports "head"
             * to just get the header content.
             */
            text: "Lib/Vendor/Require/Plugins/TextEx",

            /** DomReady Require.js plugin **/
            domReady: "Lib/Vendor/Require/Plugins/DomReady"
        },
        shim: {
            'pathjs': {
                exports: "Path"
            }
        },
        urlArgs: "bust=" + (new Date()).getTime(),
        callback: function () {
            require(["Config", "indexeddbshim"], function (Config) {
                var file,
                    specFiles = [],
                    iNdx,
                    dbSet = false;

                // Determine what we're doing with indexeddb here.  Shimming, using cordova plugin, etc.
                for (iNdx = 0; iNdx < Config.preferredDBs; ++iNdx) {
                    switch (Config.preferredDBs[iNdx]) {
                        case "sqlite":
                            if (window.cordova !== undefined) {
                                window.WebSQL = window.cordova.sqlite;
                                window.shimIndexedDB.__useShim();
                                dbSet = true;
                            }
                            break;
                        case "indexedDB":
                            if (window.indexedDB) {
                                dbSet = true;
                            }
                            break;
                        case "websql":
                            if (window.shimIndexedDB) {
                                window.shimIndexedDB.__useShim();
                                dbSet = true;
                            }
                            break;
                    }
                    if (dbSet) {
                        break;
                    }
                }

                if (isTest) {
                    for (file in window.__karma__.files) {
                        if (window.__karma__.files.hasOwnProperty(file)) {
                            if (/[\w\s\S\/]*\.spec\.js$/.test(file)) {
                                specFiles.push(file.replace("\/base\/", "http://localhost:9876/base/"));
                            }
                        }
                    }

                    specFiles.sort();
                    require(specFiles, function () {
                        window.__karma__.start();
                    });
                }
                else {
                    require(["UI/Widgets/Toolbar"], function (Toolbar) {
                        // Set title right away
                        Toolbar.setTitle("MSUD Tracker");

                        require(["Startup", "domReady!"], function (startup) {
                            startup();
                        });
                    });
                }
            });
        }
    });
}());
