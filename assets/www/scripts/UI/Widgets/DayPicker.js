define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var Utils = require("Lib/Local/Utils"),
        $ = require("jquery"),
        _ = require("underscore"),
        DayPicker;

    /**
     * A widget for selecting a day with back and forward arrows
     * @constructor
     * @memberof window.UI.Widgets
     * @param {Core.ObservableVar} valueVar value variable
     * @param {Core.ObservableVar} minValueVar min value variable
     * @param {Core.ObservableVar} maxValueVar max value variable
     */
    DayPicker = function (valueVar, minValueVar, maxValueVar) {
        this.valueVar = valueVar;
        this.minValueVar = minValueVar;
        this.maxValueVar = maxValueVar;
        this._bindMethods();
    };

    DayPicker.prototype =
    /** @lends window.UI.Widgets.DayPicker.prototype */
    {
        constructor: DayPicker.prototype.constructor,

        /**
         * Variable containing the value of this control.
         *    Control will both listen to, as well as change this var.
         * @type Core.ObservableVar
         */
        valueVar: null,

        /**
         * Variable containing the minValue of this control.
         * Observable in case the min value changes while this control is still open.
         * @type window.Core.ObservableVar
         */
        minValueVar: null,

        /**
         * Variable containing the maxValue of this control.
         * Observable in case the max value changes while this control is still open.
         * (i.e. max date is current day and day has changed.)
         * @type window.Core.ObservableVar
         */
        maxValueVar: null,

        /**
         * Container HTML Element
         * @type Element
         */
        container: null,

        /**
         * Left arrow HTML Element
         * @type Element
         */
        leftArrow: null,

        /**
         * Right arrow HTML Element
         * @type Element
         */
        rightArrow: null,

        /**
         * The HTML element for the whole thing.
         * @type Element
         */
        uiElement: null,

        /**
         * The HTML element for the containing screen
         * @type Element
         */
        screen: null,

        /**
         * Set the title (visible value) on this widget
         * @param {string} title
         */
        setTitle: function (title) {
            $(this.container).find(".DayTitle")[0].innerHTML = title;
        },

        /**
         * Initialize the UI for this widget
         * @param {Element} screen pointer to screen element on which to add this element
         * @param {string} template template for this item.
         * @param {string} [headerExt = null] Extra HTML that needs to be added to the header
         * for this widget to work/look right.  (e.g. style tags)
         */
        show: function (screen, template, headerExt) {
            var me = this,
                pickers;

            this.screen = screen;
            this.uiElement = $("<div></div>")[0];
            this.uiElement.innerHTML = template;
            this.screen.appendChild(this.uiElement);

            if (typeof headerExt === "string") {
                $('head').append(headerExt);
            }

            // Since we just appended this template, it will be the last one in the container.
            pickers = $(this.screen).find(".DayPicker");
            me.container = pickers[pickers.length - 1];
            me.leftArrow = $(this.container).find(".LeftArrow")[0];
            me.rightArrow = $(this.container).find(".RightArrow")[0];


            me.valueVar.valueChanged.add(me.refresh);
            me.minValueVar.valueChanged.add(me.refresh);
            me.maxValueVar.valueChanged.add(me.refresh);

            $(me.leftArrow).bind('click', me.handleLeftArrow);
            $(me.rightArrow).bind('click', me.handleRightArrow);

            me.refresh();
        },

        /**
         * Change the day by some increment
         * @param {int} delta day change
         */
        changeValue: function (delta) {
            var curVal = this.valueVar.getValue(),
                newEpochDay = curVal + delta;

            this.valueVar.setValue(newEpochDay);
        },

        /**
         * Handle a click of the left arrow
         */
        handleLeftArrow: function () {
            var value = -1;

            if (this.leftArrow.classList.contains("enabled")) {
                this.changeValue(value);
            }
        },

        /**
         * Handle a click of the right arrow
         */
        handleRightArrow: function () {
            var value = 1;

            if (this.rightArrow.classList.contains("enabled")) {
                this.changeValue(value);
            }
        },

        /**
         * Refresh the view of this control, depending on the current state of the day, etc.
         */
        refresh: function () {
            var selectedEpochDay = this.valueVar.getValue(),
                todayEpochDay = Utils.getEpochDayFromTime((new Date()).getTime()),
                selectedDate = new Date(),
                diff,
                maxEpochDay,
                minEpochDay;

            selectedDate.setTime(Utils.getTimeFromEpochDay(selectedEpochDay));

            diff = todayEpochDay - selectedEpochDay;

            switch (diff) {
                case 0:
                    this.setTitle("Today");
                    break;
                case 1:
                    this.setTitle("Yesterday");
                    break;
                default:
                    this.setTitle(Utils.fullDateFormat(selectedDate));
                    break;
            }

            maxEpochDay = this.maxValueVar.getValue();
            this._setCanGoForward(selectedEpochDay < maxEpochDay);

            minEpochDay = this.minValueVar.getValue();
            this._setCanGoBack(selectedEpochDay > minEpochDay);
        },

        /**
         * Clean up this control.
         */
        destroy: function () {
            var me = this;
            me.screen.removeChild(me.uiElement);
            me.screen = null;
            me.uiElement = null;
            me.container = null;
        },


        /**
         * Enable/disable the proper arrow for going backward.
         * @param {boolean} canGo whether or not we can go backward
         */
        _setCanGoBack: function (canGo) {
            var arrow = this.leftArrow;

            if (canGo) {
                arrow.classList.add("enabled");
            }
            else {
                arrow.classList.remove("enabled");
            }
        },

        /**
         * Enable/disable the proper arrow for going forward.
         * @param {boolean} canGo whether or not we can go forward
         */
        _setCanGoForward: function (canGo) {
            var arrow = this.rightArrow;

            if (canGo) {
                arrow.classList.add("enabled");
            }
            else {
                arrow.classList.remove("enabled");
            }
        },

        /**
         * Bind Methods to "this", particularly ones that will be used by observers or callbacks.
         */
        _bindMethods: function () {
            var me = this;
            me.refresh = _.bind(me.refresh, me);
            me.handleLeftArrow = _.bind(me.handleLeftArrow, me);
            me.handleRightArrow = _.bind(me.handleRightArrow, me);
        }
    };

    return DayPicker;
});