/*global window */
(function () {
        "use strict";

        var // isTest = window !== undefined && window.__karma__ !== undefined,
            Config = require("Config"),
        // file,
        // specFiles = [],
            iNdx,
            Toolbar,
            startup,
            $,
            dbSet = false,
            indexeddbshim = require("indexeddbshim");

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

        $ = require("jquery");
        $(function () {

            Toolbar = require("UI/Widgets/Toolbar");
            // Set title right away
            Toolbar.setTitle("MSUD Tracker");
            startup = require("Startup");

            startup();
        });
//        }
    }()
);
