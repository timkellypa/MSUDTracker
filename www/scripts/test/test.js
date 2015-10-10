/*global window */
(function () {
    "use strict";
    var testsContext = require.context(".", true, /\.spec\.js$/),
        indexeddbshim = require("indexeddbshim"),
        RSVP = require("rsvp"),
        Config = {
            preferredDBs: ["sqlite", "indexedDB", "websql"]
        },
        iNdx,
        dbSet = false;

    RSVP.on('error', function (e) {
        window.console.error("Promise Error: " + e);
        throw e;
    });

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
                if (window.shimIndexedDB && indexeddbshim) {
                    window.shimIndexedDB.__useShim();
                    dbSet = true;
                }
                break;
        }
        if (dbSet) {
            break;
        }
    }

    testsContext.keys().forEach(testsContext);
    window.__karma__.start();
}());
