define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*jslint unparam: true */
define(function(require) {
    "use strict";
	var Widgets;
	/**
	 * Widgets are building blocks of the app.  Small sections of the page that do a very specific function.
	 * They should be bound to observable objects in the ViewModel to receive and fire change notifications.
	 * @namespace
	 * @memberof window.UI
	 */
	Widgets = {
		DayPicker: require("UI/Widgets/DayPicker"),
		DaySummaryTable: require("UI/Widgets/DaySummaryTable"),
		Gauge: require("UI/Widgets/Gauge"),
		Toolbar: require("UI/Widgets/Toolbar"),
		Menu: require("UI/Widgets/Menu")
	};
	return Widgets;
});