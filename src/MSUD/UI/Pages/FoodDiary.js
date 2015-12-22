import IPage from "../../../Core/UI/IPage";
import Toolbar from "../../../MSUD/UI/Toolbar";
import Menu from "../../../MSUD/UI/Menu";
import $ from "jquery";
import DiarySummaryViewModel from "../../ViewModel/DiarySummaryViewModel";
import DayPicker from "../../../Core/UI/Widgets/DayPicker";
import menuTemplate from "!!raw!../../UI/Templates/MainMenu.html";
import dayPickerTemplate from "!!raw!../../UI/Templates/DayPicker.html";
import DaySummaryTable from "../../UI/Widgets/DaySummaryTable";
import daySummaryTableTemplate from "!!raw!../../UI/Templates/DaySummaryTable.html";
import _ from "underscore";

/**
 * Diary showing food eaten during a day
 **/
export default class FoodDiary extends IPage {
    /**
     * Constructs FoodDiary
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
    }

    /**
     * Show UI for the diary page.
     */
    show(options) {
        let that = this,
            dayPicker,
            daySummaryTable;
        return super.show(options).then(() => {
            that.context = new DiarySummaryViewModel(options.day);
            that.addListeners();
            return that.context.init();
        }).then(
            function () {
                that.$el.addClass("FoodDiary");

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

                that.dayPicker = dayPicker;
                that.daySummaryTable = daySummaryTable;
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
     * Destroy this view.
     */
    destroy() {
        this.$el.removeClass("FoodDiary");
        this.removeListeners();
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