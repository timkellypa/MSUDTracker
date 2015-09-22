
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var $ = require("jquery"),
        ObserverPair = require("../../Core/ObserverPair"),
        Utils = require("../../Lib/Local/Utils"),
        Menu,
        menuActive = 'menuActive';

    /**
     * Static class that allows for customization of the menu.
     * Not really a widget per say, as it is static and assumes elements (by id) exist in the app HTML.
     * @namespace
     * @memberof window.UI.Widgets
     * @assumes
     * 1.  There is an element with an ID of "Window."  This contains the menu as well as the page content.
     * 2.  Window has a CSS class called "menuActive", which activates the menu.
     * 3.  Menu links have a CSS class of "MenuLink".  These should be anchor tags that follow standard "route"
     * functionality, for params and such.
     *
     **/
    Menu =
    /** @lends window.UI.Widgets.Menu */
    {
        /**
         * Reverses whatever the state of the menu currently is
         * by adding or removing the "menuActive" class from Window.
         */
        toggleMenu: function () {
            var win = $("#Window")[0];

            if (win.classList.contains(menuActive)) {
                this.menuOff();
            }
            else {
                this.menuOn();
            }
        },

        /**
         * Adds "menuActive" class to Window if it does not already exist.
         * CSS should handle expanding the menu when this happens.
         * @param {Event} [e] window event.  If function actually does something, will stop propagation of
         * this event.
         * @returns {boolean} whether or not the function actually had to add this class.  False if it was already there
         */
        menuOn: function (e) {
            var win = $("#Window")[0];

            if (!win.classList.contains(menuActive)) {
                win.classList.add(menuActive);
                if (e) {
                    e.stopPropagation();
                }
                return true;
            }
            return false;
        },

        /**
         * Removes "menuActive" class to Window if it exists.
         * CSS should handle closing the menu when this happens.
         * @param {Event} e window event.  If function actually does something, will stop propagation of
         * this event.
         * @returns {boolean} whether or not the function actually had to remove this class.  False if it was already
         *     gone
         */
        menuOff: function (e) {
            var win = $("#Window")[0];

            if (win.classList.contains(menuActive)) {
                win.classList.remove(menuActive);
                if (e) {
                    e.stopPropagation();
                }
                return true;
            }
            return false;
        },

        /**
         * Array of observer pairs for handlers of parameter changing functions.
         * These typically listen to an observer, and change the subsequent parameter for all links that contain it.
         * @type {Array.<window.Core.ObserverPair>}
         */
        _paramObserverPairs: [],

        addParamObserver: function (observableVar, paramName) {
            var observerPair,
                fnChangeParamValue = function () {
                    var aMenuLinks = $(".MenuLink"),
                        iNdx,
                        href,
                        newHref,
                        fnHrefReplace;


                    /*jslint unparam: true */
                    fnHrefReplace = function (a, b, c, d) {
                        return b + observableVar.getValue() + d;
                    };
                    /*jslint unparam: false */

                    for (iNdx = 0; iNdx < aMenuLinks.length; ++iNdx) {
                        href = aMenuLinks[iNdx].href;
                        newHref = href.replace(new RegExp("(\\#.*\\/" + paramName + "\\/)([^/]*)(.*)", "ig"),
                                               fnHrefReplace);
                        aMenuLinks[iNdx].href = newHref;
                    }
                };

            observerPair = new ObserverPair(observableVar.valueChanged, fnChangeParamValue);
            observerPair.register();
            this._paramObserverPairs.push(observerPair);

            // Run for the initial value of the variable.
            fnChangeParamValue();
        },

        /**
         * Build Menu HTML from a template
         * @param {string} template
         */
        buildFromTemplate: function (template) {
            var menuElement = $("#Menu")[0];

            menuElement.innerHTML = Utils.getHTMLBody(template);
        },

        clearMenu: function () {
            var observerPair,
                menuElement = $("#Menu")[0];

            while (this._paramObserverPairs.length > 0) {
                observerPair = this._paramObserverPairs.splice(0, 1)[0];
                observerPair.destroy();
            }

            menuElement.innerHTML = "";
        }
    };

    return Menu;
});