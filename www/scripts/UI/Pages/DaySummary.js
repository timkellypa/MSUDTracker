import Toolbar from "UI/Widgets/Toolbar";
import Menu from "UI/Widgets/Menu";
import menuTemplate from "!!raw!UI/Templates/MainMenu.html";
import DayPicker from "UI/Widgets/DayPicker";
import dayPickerTemplate from "!!raw!UI/Templates/DayPicker.html";
import DaySummaryTable from "UI/Widgets/DaySummaryTable";
import daySummaryTableTemplate from "!!raw!UI/Templates/DaySummaryTable.html";
import Gauge from "UI/Widgets/Gauge";
import carrotGaugeTemplate from "!!raw!UI/Templates/CarrotGauge.html";
import DiaryViewModel from "ViewModel/DiaryViewModel";
import $ from "jquery";
import _ from "underscore";

/**
 * Home page. Summary of daily data.
 */
export default class DaySummary {

    /**
     * Construct DaySummary
     */
    constructor() {
        /**
         * Context for this view
         * @type {DiaryViewModel}
         */
        this.context = null;

        /**
         * Day picker widget
         * @type {DayPicker}
         */
        this.dayPicker = null;

        /**
         * Current day's summary table
         * @type {DaySummaryTable}
         */
        this.daySummaryTable = null;

        /**
         * Carrot gauge
         * @type {Gauge}
         */
        this.carrotGauge = null;
    }

    /**
     * Build the UI for the page
     * @param {number} [day] Day to use.  If not defined, will use epoch day for today.
     * @returns {Promise}
     */
    init(day) {
        let screen = $("#Screen")[0],
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
    }

    /**
     * Bind methods to "this" in case they are called without context.
     * @private
     */
    _bindMethods() {
        var that = this;
        that._loadUI = _.bind(that._loadUI, that);
    }

    /**
     * Add event listeners
     * @private
     */
    _addListeners() {
        this.context.isLoading.valueChanged.add(this._loadUI);
    }

    /**
     * Clean up event listeners
     * @private
     */
    _removeListeners() {
        this.context.isLoading.valueChanged.remove(this._loadUI);
    }

    /**
     * Destroy the UI, event listeners, menu, and references to objects for this page
     */
    destroy() {
        Toolbar.removeMenuIconHandler();
        $($("#Content")[0]).off("click", Menu.menuOff);

        Menu.clearMenu();
        this._removeListeners();

        this.dayPicker.destroy();
        this.daySummaryTable.destroy();
        this.carrotGauge.destroy();

        this.context.destroy();
        this.context = null;
    }

    /**
     * Load up the UI for this page
     * @private
     */
    _loadUI() {
        var win = $("#Window")[0];

        if (this.context.isLoading.getValue()) {
            win.classList.add("passiveLoad");
        }
        else {
            win.classList.remove("passiveLoad");
        }
    }
}