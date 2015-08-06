define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {
    "use strict";
	var $ = require("jquery"),
	Toolbar;

	/**
	 * Static class that allows for customization of the toolbar.
	 * Not really a widget per say, as it is static and assumes elements (by id) exist in the app HTML.
	 * @namespace
	 * @memberof window.UI.Widgets
	 * @assumes There is an element with the ID of Title.
	**/
	Toolbar =
	/** @lends window.UI.Widgets.Toolbar */
	{
		/**
		 * Return the HTML UI element containing our title.
		 */
		_getTitle: function() {
			return $("#Title")[0];
		},
		
		/**
		 * Set the title
		 * @param {string} title New title to be set
		 */
		setTitle: function(title) {
			this._getTitle().innerHTML = title;
		}
	};
	
	return Toolbar;
});