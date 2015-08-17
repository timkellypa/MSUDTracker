define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var Toolbar = require("UI/Widgets/Toolbar"),
        DayPicker = require("UI/Widgets/DayPicker"),
        dayPickerTemplate = require("text!UI/Templates/DayPicker.html!strip"),
        dayPickerHeader = require("text!UI/Templates/DayPicker.html!head"),
        DaySummaryTable = require("UI/Widgets/DaySummaryTable"),
        daySummaryTableTemplate = require("text!UI/Templates/DaySummaryTable.html!strip"),
        daySummaryTableHeader = require("text!UI/Templates/DaySummaryTable.html!head"),
        Gauge = require("UI/Widgets/Gauge"),
        carrotGaugeTemplate = require("text!UI/Templates/CarrotGauge.html!strip"),
        carrotGaugeHeader = require("text!UI/Templates/CarrotGauge.html!head"),
        DiaryViewModel = require("ViewModel/DiaryViewModel"),
        $ = require("jquery"),
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
         */
        init: function () {
            var screen = $("#Screen")[0],
                viewModel = new DiaryViewModel(),
                dayPicker,
                daySummaryTable,
                carrotGauge;

            Toolbar.setTitle("MSUD Tracker :: Home");
            Toolbar.setMenuIconHandler(function () {
                throw "Unimplemented!";
            });

            dayPicker = new DayPicker(viewModel.currentDay,
                viewModel.dayPickerMinValue, viewModel.dayPickerMaxValue);
            dayPicker.show(screen, dayPickerTemplate, dayPickerHeader);

            daySummaryTable = new DaySummaryTable(viewModel.foodDiaryDaySummary);
            daySummaryTable.show(screen, daySummaryTableTemplate, daySummaryTableHeader);

            carrotGauge = new Gauge(
                viewModel.foodDiaryDaySummary.leucineAllowance,
                viewModel.foodDiaryDaySummary.leucineAmount
            );

            carrotGauge.show(screen, carrotGaugeTemplate, carrotGaugeHeader);
        }
    };

    return DaySummary;
});