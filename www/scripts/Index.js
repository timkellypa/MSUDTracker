define(["Config"], function (config) {
    "use strict";
    /*global require, window */
    require.config({
        baseURL: "scripts",
        paths: {
            jquery: config.Globals.jquery,
            underscore: config.Globals.underscore,
            rsvp: config.Globals.rsvp,
            pathjs: config.Globals.pathjs,
            moment: config.Globals.moment,
            domReady: config.Globals.domReady,
            text: config.Globals.text
        },
        shim: {
            'pathjs': {
                exports: "Path"
            }
        },
        urlArgs: "bust=" + (new Date()).getTime()
    });


    /**
     * Single entry point for app.
     *  Sets up "require" environment, including path for third party modules.
     *  Also launches the app home or the test app
     * @constructor Index
     */
    (function () {
        require(["UI/Widgets/Toolbar"], function (Toolbar) {
            // Set title right away
            Toolbar.setTitle("MSUD Tracker");

            require(["Startup", "domReady!"], function (startup) {
                startup();
            });
        });
    }());
});