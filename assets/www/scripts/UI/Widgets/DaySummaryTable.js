define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var $ = require("jquery"), _ = require("underscore"), DaySummaryTable;

    /**
     * A widget for displaying day summary
     *
     * @constructor
     * @memberof window.UI.Widgets
     * @param {window.ViewModel.Classes.FoodDiaryDaySummary} foodDiaryDaySummary
     * food diary summary of the day. Contains all properties needed for this table.
     */
    DaySummaryTable = function (foodDiaryDaySummary) {
        this.foodDiaryDaySummary = foodDiaryDaySummary;
        this._bindMethods();
    };

    DaySummaryTable.prototype =
    /** @lends window.UI.Widgets.DaySummaryTable.prototype */
    {
        constructor: DaySummaryTable.prototype.constructor,

        /**
         * Summary of food consumption for a day.
         *
         * @type window.ViewModel.Classes.FoodDiaryDaySummary
         */
        foodDiaryDaySummary: null,

        /**
         * Div for leu remaining
         *
         * @type Element
         */
        leuRemainingDiv: null,

        /**
         * Div for leu consumed
         *
         * @type Element
         */
        leuConsumedDiv: null,

        /**
         * Div for leu allowed
         *
         * @type Element
         */
        leuAllowedDiv: null,

        /**
         * Div for calorie goal
         *
         * @type Element
         */
        calorieGoalDiv: null,

        /**
         * Div for calorie consumed
         *
         * @type Element
         */
        calorieConsumedDiv: null,

        /**
         * Div for calorie remaining
         *
         * @type Element
         */
        calorieRemainingDiv: null,

        /**
         * Screen containing this element
         * @type Element
         */
        screen: null,

        /**
         * UI Element for this item
         * @type Element
         */
        uiElement: null,

        /**
         * Initialize the UI for this widget
         *
         * @param {Element} screen pointer to screen element on which to add this
         *            element
         * @param {string} template template for this item.
         * @param {string} [headerExt = null] Extra HTML that needs to be added to
         *            the header for this widget to work/look right. (e.g. style
         *            tags)
         */
        show: function (screen, template, headerExt) {
            var me = this,
                summaries;

            this.screen = screen;
            this.uiElement = $("<div></div>")[0];

            this.uiElement.innerHTML = template;
            this.screen.appendChild(this.uiElement);

            if (typeof headerExt === "string") {
                $('head').append(headerExt);
            }

            // Since we just appended this template, it will be the last one in
            // the container.
            summaries = $(this.screen).find(".DaySummaryTable");

            me.container = summaries[summaries.length - 1];

            me.leuRemainingDiv = $(this.container).find(".LeuRemainingNum")[0];
            me.leuConsumedDiv = $(this.container).find(".LeuConsumedNum")[0];
            me.leuAllowedDiv = $(this.container).find(".LeuAllowedNum")[0];

            me.calorieGoalDiv = $(this.container).find(".CalorieGoalNum")[0];
            me.calorieConsumedDiv = $(this.container).find(
                ".CalorieConsumedNum")[0];
            me.calorieRemainingDiv = $(this.container).find(
                ".CalorieRemainingNum")[0];

            me._addListeners();

            me.refresh();
        },

        /**
         * Refresh the view of this control, depending on the current state of
         * the day, etc.
         */
        refresh: function () {
            var me = this, leuAllowed = me.foodDiaryDaySummary.leucineAllowance
                .getValue(), leuAmount = me.foodDiaryDaySummary.leucineAmount
                .getValue(), calorieGoal = me.foodDiaryDaySummary.calorieGoal
                .getValue(), calorieAmount = me.foodDiaryDaySummary.calorieAmount
                .getValue();

            me.leuRemainingDiv.innerHTML = (leuAllowed - leuAmount);
            me.leuConsumedDiv.innerHTML = leuAmount;
            me.leuAllowedDiv.innerHTML = leuAllowed;

            me.calorieRemainingDiv.innerHTML = (calorieGoal - calorieAmount);
            me.calorieConsumedDiv.innerHTML = calorieAmount;
            me.calorieGoalDiv.innerHTML = calorieGoal;
        },

        _addListeners: function () {
            var me = this;
            me.foodDiaryDaySummary.leucineAmount.valueChanged.add(me.refresh);
            me.foodDiaryDaySummary.leucineAllowance.valueChanged
                .add(me.refresh);

            me.foodDiaryDaySummary.calorieAmount.valueChanged.add(me.refresh);
            me.foodDiaryDaySummary.calorieGoal.valueChanged.add(me.refresh);
        },

        _removeListeners: function () {
            var me = this;
            me.foodDiaryDaySummary.leucineAmount.valueChanged
                .remove(me.refresh);
            me.foodDiaryDaySummary.leucineAllowance.valueChanged
                .remove(me.refresh);

            me.foodDiaryDaySummary.calorieAmount.valueChanged
                .remove(me.refresh);
            me.foodDiaryDaySummary.calorieGoal.valueChanged.remove(me.refresh);
        },

        /**
         * Clean up this control.
         */
        destroy: function () {
            var me = this;
            me._removeListeners();
            me.screen.removeChild(me.uiElement);
            me.screen = null;
            me.uiElement = null;
            me.container = null;
            me.leuRemainingDiv = null;
            me.leuConsumedDiv = null;
            me.leuAllowedDiv = null;

            me.calorieGoalDiv = null;
            me.calorieConsumedDiv = null;
            me.calorieRemainingDiv = null;
        },

        /**
         * Bind Methods to "this", particularly ones that will be used by observers or callbacks.
         */
        _bindMethods: function () {
            var me = this;
            me.refresh = _.bind(me.refresh, me);
        }
    };

    return DaySummaryTable;
});