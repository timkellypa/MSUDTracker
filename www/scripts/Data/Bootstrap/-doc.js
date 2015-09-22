
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*jslint unparam: true */
define(function(require) {
    "use strict";
	var Bootstrap;
	/**
	 * Contains data in JSON format that should be loaded when the application starts.
	 * Put things in the "test" folder for things that should only be loaded in "Test" mode.
	 * Naming convention for files should be "{TableName}Data.json"
	 * @namespace
	 * @memberof window.Data
	 */
	Bootstrap = {
	};
	return Bootstrap;
});