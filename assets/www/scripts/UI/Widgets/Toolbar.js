define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
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
        _getTitle: function () {
            return $("#Title")[0];
        },

        _getMenuIconContainer: function() {
            // RTL languages should return top right corner, eventually
            return $("#TopLeftContainer")[0];
        },

        /**
         * Set the title
         * @param {string} title New title to be set
         */
        setTitle: function (title) {
            this._getTitle().innerHTML = title;
        },


        setMenuIconVisibile: function (visible) {
            if (visible) {
                this._getMenuIconContainer().visibility = "visible";
            }
            else {
                this._getMenuIconContainer().visibility = "collapsed";
            }
        },

        setMenuIconHandler: function(method) {
            $(this._getMenuIconContainer()).on("click", method);
        }
    };

    return Toolbar;
});