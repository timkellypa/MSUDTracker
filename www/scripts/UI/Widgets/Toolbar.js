define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var $ = require("jquery"),
        Toolbar,
        menuActive = 'menuActive';

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

        _menuIconHandler: null,

        removeMenuIconHandler: function () {
            if (this._menuIconHandler) {
                $(this._getMenuIconContainer()).off("click", this._menuIconHandler);
            }
            this._menuIconHandler = null;
        },

        setMenuIconHandler: function(method) {
            this.removeMenuIconHandler();
            this._menuIconHandler = method;
            $(this._getMenuIconContainer()).on("click", this._menuIconHandler);
        },

        toggleMenu: function () {
            var win = $("#Window")[0];

            if (win.classList.contains(menuActive)) {
                this.menuOff();
            }
            else {
                this.menuOn();
            }
        },
        menuOn: function () {
            var win = $("#Window")[0],
                menu = $("#Menu")[0],
                menuLink = $("#TopLeftContainer")[0];

            if (!win.classList.contains(menuActive)) {
                win.classList.add(menuActive);
                menu.classList.add(menuActive);
                menuLink.classList.add(menuActive);
                return true;
            }
            return false;
        },
        menuOff: function () {
            var win = $("#Window")[0],
                menu = $("#Menu")[0],
                menuLink = $("#TopLeftContainer")[0];

            if (win.classList.contains(menuActive)) {
                win.classList.remove(menuActive);
                menu.classList.remove(menuActive);
                menuLink.classList.remove(menuActive);
                return true;
            }
            return false;
        }
    };

    return Toolbar;
});