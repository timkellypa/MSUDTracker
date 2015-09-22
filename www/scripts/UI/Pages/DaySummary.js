
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var Toolbar = require("UI/Widgets/Toolbar"),
        Menu = require("UI/Widgets/Menu"),
        menuTemplate = require("!!raw!UI/Templates/MainMenu.html"),
        DayPicker = require("UI/Widgets/DayPicker"),
        dayPickerTemplate = require("!!raw!UI/Templates/DayPicker.html"),
        DaySummaryTable = require("UI/Widgets/DaySummaryTable"),
        daySummaryTableTemplate = require("!!raw!UI/Templates/DaySummaryTable.html"),
        Gauge = require("UI/Widgets/Gauge"),
        carrotGaugeTemplate = require("!!raw!UI/Templates/CarrotGauge.html"),
        DiaryViewModel = require("ViewModel/DiaryViewModel"),
        $ = require("jquery"),
        _ = require("underscore"),
        DaySummary;

    /**
     * Home page. Summary of daily data.
     * @constructor
     * @memberof window.UI.Pages
     */
    DaySummary = function () {
        return this;
    };

    DaySummary.prototype =
    /** @lends window.UI.Pages.DaySummary.prototype */
    {
        constructor: DaySummary.prototype.constructor,
        /**
         * Build the UI for the page
         * @param {number} [day] Day to use.  If not defined, will use epoch day for today.
         * @returns {Promise}
         */
        init: function (day) {
            var screen = $("#Screen")[0],
                that = this,
                dayPicker,
                daySummaryTable,
                carrotGauge;

            this.context = new DiaryViewModel(day);

            this._bindMethods();
            this._addListeners();

            return this.context.init().then(
                function () {
                    Toolbar.setTitle("MSUD Tracker :: Home");

                    $($("#Content")[0]).on("click", Menu.menuOff);

                    Toolbar.setMenuIconHandler(Menu.menuOn);

                    Menu.buildFromTemplate(menuTemplate);
                    Menu.addParamObserver(that.context.currentDay, "day");

                    dayPicker = new DayPicker(that.context.currentDay,
                                              that.context.dayPickerMinValue, that.context.dayPickerMaxValue);
                    dayPicker.show(screen,
                                   dayPickerTemplate
                    );

                    daySummaryTable = new DaySummaryTable(that.context.foodDiaryDaySummary);
                    daySummaryTable.show(screen, daySummaryTableTemplate);

                    carrotGauge = new Gauge(
                        that.context.foodDiaryDaySummary.leucineAllowance,
                        that.context.foodDiaryDaySummary.leucineAmount
                    );

                    carrotGauge.show(screen, carrotGaugeTemplate);

                    that.dayPicker = dayPicker;
                    that.daySummaryTable = daySummaryTable;
                    that.carrotGauge = carrotGauge;
                }
            );
        },

        dayPicker: null,
        daySummaryTable: null,
        carrotGauge: null,

        _bindMethods: function () {
            var that = this;
            that._loadUI = _.bind(that._loadUI, that);
        },

        _addListeners: function () {
            this.context.isLoading.valueChanged.add(this._loadUI);
        },

        _removeListeners: function () {
            this.context.isLoading.valueChanged.remove(this._loadUI);
        },

        destroy: function () {
            Toolbar.removeMenuIconHandler();
            $($("#Content")[0]).off("click", Menu.menuOff);

            Menu.clearMenu();
            this._removeListeners();

            this.dayPicker.destroy();
            this.daySummaryTable.destroy();
            this.carrotGauge.destroy();

            this.context.destroy();
            this.context = null;
        },

        context: null,

        _loadUI: function () {
            var win = $("#Window")[0];

            if (this.context.isLoading.getValue()) {
                win.classList.add("passiveLoad");
            }
            else {
                win.classList.remove("passiveLoad");
            }
        }
    };

    return DaySummary;
});