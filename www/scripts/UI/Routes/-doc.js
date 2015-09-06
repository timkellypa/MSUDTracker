define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*jslint unparam: true */
define(function (require) {
    "use strict";
    var Routes;
    /**
     * Routes handle navigation of the app.
     * For now, we are using a single file (Routes.js) to do all navigation handling, since we only have a few pages.
     * These routes will allow us to use URLs to navigate around the app, using PathJS to listen to
     * our URL changes.
     * @namespace
     * @memberof window.UI
     */
    Routes = {
        Router: require("UI/Routes/Router")
    };
    return Routes;
});