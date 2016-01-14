/*global window */
import {} from "indexeddbshim";
import $ from "jquery";
import colorbox from "jquery-colorbox";
import Toolbar from "./UI/Toolbar";
import Startup from "./Startup";
import Config from "./Config";

var dbSet = false;

// Determine what we're doing with indexeddb here.  Shimming, using cordova plugin, etc.
for (let iNdx = 0, len = Config.Globals.preferredDBs.length; iNdx < len; ++iNdx) {
    switch (Config.Globals.preferredDBs[iNdx]) {
        case "sqlite":
            if (window.cordova !== undefined) {
                window.WebSQL = window.cordova.sqlite;
                window.shimIndexedDB.__useShim();
                dbSet = true;
            }
            break;
        case "indexeddb":
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

if (colorbox) {
    $.hasColorBox = true;
}

$(function () {
    let RSVP = require("rsvp");
    RSVP.on('error', function (e) {
        window.console.error("Promise Error: ", e);
        throw e;
    });

    // Set title right away
    Toolbar.setTitle("MSUD Tracker");

    Startup.start();
});