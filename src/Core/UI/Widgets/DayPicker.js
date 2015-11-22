import DateHelpers from "../../Lib/DateHelpers";
import $ from "jquery";
import _ from "underscore";
import IWidget from "../IWidget";

/**
 * A widget for selecting a day with back and forward arrows
 **/
export default class DayPicker extends IWidget {

    /**
     * Constructs DayPicker
     * @memberof window.UI.Widgets
     * @param {Object} options options for this widget.
     * @param {ObservableVar} options.value value variable
     * @param {ObservableVar} options.min min value variable
     * @param {ObservableVar} options.max max value variable
     */
    constructor(options) {
        super(options);
        /**
         * Variable containing the value of this control.
         *    Control will both listen to, as well as change this var.
         * @type {ObservableVar}
         */
        this.value = options.value;

        /**
         * Variable containing the minValue of this control.
         * Observable in case the min value changes while this control is still open.
         * @type {ObservableVar}
         */
        this.min = options.min;

        /**
         * Variable containing the maxValue of this control.
         * Observable in case the max value changes while this control is still open.
         * (i.e. max date is current day and day has changed.)
         * @type {ObservableVar}
         */
        this.max = options.max;

        /**
         * Left arrow HTML Element
         * @type {Element}
         */
        this.leftArrow = null;

        /**
         * Right arrow HTML Element
         * @type {Element}
         */
        this.rightArrow = null;
    }

    /**
     * Set the title (visible value) on this widget
     * @param {string} title
     */
    setTitle(title) {
        this.$el.find(".DayTitle")[0].innerHTML = title;
    }

    /**
     * Initialize the UI for this widget
     * @param {Object} options options for the show method.
     */
    show(options) {
        super.show(options);

        this.leftArrow = this.$el.find(".LeftArrow")[0];
        this.rightArrow = this.$el.find(".RightArrow")[0];

        this.value.valueChanged.add(this.refresh);
        this.min.valueChanged.add(this.refresh);
        this.max.valueChanged.add(this.refresh);

        $(this.leftArrow).bind('click', this.handleLeftArrow);
        $(this.rightArrow).bind('click', this.handleRightArrow);

        this.refresh();
    }

    /**
     * Change the day by some increment
     * @param {number} delta day change
     */
    changeValue(delta) {
        var curVal = this.value.getValue(),
            newEpochDay = curVal + delta;

        this.value.setValue(newEpochDay);
    }

    /**
     * Handle a click of the left arrow
     */
    handleLeftArrow() {
        var value = -1;

        if (this.leftArrow.classList.contains("enabled")) {
            this.changeValue(value);
        }
    }

    /**
     * Handle a click of the right arrow
     */
    handleRightArrow() {
        var value = 1;

        if (this.rightArrow.classList.contains("enabled")) {
            this.changeValue(value);
        }
    }

    /**
     * Refresh the view of this control, depending on the current state of the day, etc.
     */
    refresh() {
        var selectedEpochDay = this.value.getValue(),
            todayEpochDay = DateHelpers.getEpochDayFromTime((new Date()).getTime()),
            selectedDate = new Date(),
            diff,
            maxEpochDay,
            minEpochDay;

        selectedDate.setTime(DateHelpers.getTimeFromEpochDay(selectedEpochDay));

        diff = todayEpochDay - selectedEpochDay;

        switch (diff) {
            case 0:
                this.setTitle("Today");
                break;
            case 1:
                this.setTitle("Yesterday");
                break;
            default:
                this.setTitle(DateHelpers.fullDateFormat(selectedDate));
                break;
        }

        maxEpochDay = this.max.getValue();
        this._setCanGoForward(selectedEpochDay < maxEpochDay);

        minEpochDay = this.min.getValue();
        this._setCanGoBack(selectedEpochDay > minEpochDay);
    }

    /**
     * Clean up this control.
     */
    destroy() {
        super.destroy();
    }


    /**
     * Enable/disable the proper arrow for going backward.
     * @param {boolean} canGo whether or not we can go backward
     */
    _setCanGoBack(canGo) {
        var arrow = this.leftArrow;

        if (canGo) {
            arrow.classList.add("enabled");
        }
        else {
            arrow.classList.remove("enabled");
        }
    }

    /**
     * Enable/disable the proper arrow for going forward.
     * @param {boolean} canGo whether or not we can go forward
     */
    _setCanGoForward(canGo) {
        var arrow = this.rightArrow;

        if (canGo) {
            arrow.classList.add("enabled");
        }
        else {
            arrow.classList.remove("enabled");
        }
    }

    /**
     * Bind Methods to "this", particularly ones that will be used by observers or callbacks.
     */
    bindMethods() {
        this.refresh = _.bind(this.refresh, this);
        this.handleLeftArrow = _.bind(this.handleLeftArrow, this);
        this.handleRightArrow = _.bind(this.handleRightArrow, this);
    }
}