define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*jslint unparam: true */
define(function(require) {
    "use strict";
	var Vendor;
	/**
	 * Third-party utilities utilized by the application.  Kept separately to exclude from lint, etc.
	 * and kept out of the way of the rest of the application's code.
	 * @namespace
	 * @memberof window.Lib
	 */
	Vendor = {
	};
	return Vendor;
});