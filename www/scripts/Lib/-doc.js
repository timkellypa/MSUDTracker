define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*jslint unparam: true */
define(function(require) {
    "use strict";
	var Lib;
	/**
	 * Libraries utilized by the application.  Split into local and vendor categories.
	 * Vendor utils are excluded from lint, etc. since they typically still have some warnings.
	 * @namespace
     * @memberof window
	 */
	Lib = {
	};
	return Lib;
});