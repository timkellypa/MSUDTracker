import IPage from "../../../Core/UI/IPage";
import Toolbar from "../Toolbar";
import Menu from "../Menu";
import menuTemplate from "!!raw!../../UI/Templates/MainMenu.html";
import DayPicker from "../../../Core/UI/Widgets/DayPicker";
import dayPickerTemplate from "!!raw!../../UI/Templates/DayPicker.html";
import DaySummaryTable from "../../UI/Widgets/DaySummaryTable";
import daySummaryTableTemplate from "!!raw!../../UI/Templates/DaySummaryTable.html";
import Gauge from "../../UI/Widgets/Gauge";
import carrotGaugeTemplate from "!!raw!../../UI/Templates/CarrotGauge.html";
import DiarySummaryViewModel from "../../ViewModel/DiarySummaryViewModel";
import $ from "jquery";
import _ from "underscore";

/**
 * Home page. Summary of daily data.
 * @extends {IPage}
 */
export default class DaySummary extends IPage {

    /**
     * Construct DaySummary
     */
    constructor() {
        super();
        this.bindMethods();

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
     * @param {Object} options options for showing this widget.
     * @param {number} [options.day] Day to use.  If not defined, will use epoch day for today.
     * @returns {Promise}
     */
    show(options) {
        super.show(options);
        let that = this,
            dayPicker,
            daySummaryTable,
            carrotGauge;

        this.context = new DiarySummaryViewModel(options.day);

        this.addListeners();

        return this.context.init().then(
            function () {
                Toolbar.setTitle("MSUD Diet");

                $($("#content")[0]).on("click", Menu.menuOff);

                Toolbar.setMenuIconHandler(Menu.menuOn);

                Menu.buildFromTemplate(menuTemplate);
                Menu.addParamObserver(that.context.diaryViewModel.currentDay, "day");

                dayPicker = new DayPicker(
                    {
                        value: that.context.diaryViewModel.currentDay,
                        min: that.context.diaryViewModel.dayPickerMinValue,
                        max: that.context.diaryViewModel.dayPickerMaxValue
                    });

                dayPicker.show(
                    {
                        container: that.$el[0],
                        template: dayPickerTemplate
                    }
                );

                daySummaryTable = new DaySummaryTable({
                    context: that.context
                });
                daySummaryTable.show(
                    {
                        container: that.$el[0],
                        template: daySummaryTableTemplate
                    }
                );

                carrotGauge = new Gauge(
                    {
                        total: that.context.personalInfoViewModel.leucineAllowance,
                        amount: that.context.leucineAmount
                    }
                );

                carrotGauge.show({
                    container: that.$el[0],
                    template: carrotGaugeTemplate
                });

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
    bindMethods() {
        var that = this;
        that._loadUI = _.bind(that._loadUI, that);
    }

    /**
     * Add event listeners
     * @private
     */
    addListeners() {
        this.context.isLoading.valueChanged.add(this._loadUI);
    }

    /**
     * Clean up event listeners
     * @private
     */
    removeListeners() {
        this.context.isLoading.valueChanged.remove(this._loadUI);
    }

    /**
     * Destroy the UI, event listeners, menu, and references to objects for this page
     */
    destroy() {
        Toolbar.removeMenuIconHandler();
        $($("#content")[0]).off("click", Menu.menuOff);

        Menu.clearMenu();
        this.removeListeners();

        this.dayPicker.destroy();
        this.daySummaryTable.destroy();
        this.carrotGauge.destroy();

        this.context.destroy();
        this.context = null;
        super.destroy();
    }

    /**
     * Load up the UI for this page
     * @private
     */
    _loadUI() {
        var win = $("#window")[0];

        if (this.context.isLoading.getValue()) {
            win.classList.add("passive-load");
        }
        else {
            win.classList.remove("passive-load");
        }
    }
}