define(["Config"], function(config) {
    "use strict";
    /*global require */
    require.config({
        baseURL: "scripts",
        paths: {
            jquery: config.Globals.jquery,
            underscore: config.Globals.underscore,
            rsvp: config.Globals.rsvp,
            moment: config.Globals.moment,
            domReady: config.Globals.domReady,
            text: config.Globals.text
        }
    });

	/**
	 * Single entry point for app.
	 *  Sets up "require" environment, including path for third party modules.
	 *  Also launches the app home or the test app
	 * @constructor Index
	 */
	(function() {
		require(["UI/Pages/DaySummary", "domReady!"], function(Summary) {
			var s = new Summary();
			s.init();
		});
	}());
});