define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*global window */
define(function (require) {
    "use strict";
    var Router,
        Path = require("pathjs"),
        Menu = require("../Widgets/Menu"),
        Utils = require("../../Lib/Local/Utils"),
        $ = require("jquery"),
        DaySummary = require("../Pages/DaySummary");

    /**
     * Router. Creates a router of URL requests.
     * @constructor
     * @memberof window.UI.Pages
     */
    Router = function () {
        return this;
    };

    Router.prototype =
    /** @lends window.UI.Pages.DaySummary.prototype */
    {
        constructor: Router.prototype.constructor,

        currentPage: null,

        clearCurrentPage: function () {
            if (this.currentPage) {
                this.currentPage.destroy();
            }
        },

        init: function () {
            var that = this,
                bPathIsValid = false,
                firstLoad = true;

            Path.map("#/daysummary/day/:day").to(function () {
                var day = parseInt(this.params.day, 10),
                    loadClass = firstLoad ? "initialLoad" : "pageLoad";

                $("#Window")[0].classList.add(loadClass);

                bPathIsValid = true;
                if (isNaN(day)) {
                    day = null;
                }
                Menu.menuOff();
                that.clearCurrentPage();
                that.currentPage = new DaySummary();
                that.currentPage.init(day, firstLoad)
                    .finally(
                    function () {
                        $("#Window")[0].classList.remove(loadClass);
                    }
                );
            });

            Path.listen();

            firstLoad = false;

            // By default, go to today.
            if (!bPathIsValid) {
                window.location = "#/daysummary/day/" + Utils.getEpochDayFromTime((new Date()).getTime());
            }
        }
    };

    return Router;
});