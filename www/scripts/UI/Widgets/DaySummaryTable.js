import $ from "jquery";
import _ from "underscore";
import Utils from "../../Lib/Local/Utils";

/**
 * A widget for displaying day summary
 */
export default class DaySummaryTable {
    /**
     * Constructs the DaySummaryTable widget
     * @constructor
     * @param {FoodDiaryDaySummary} foodDiaryDaySummary
     * food diary summary of the day. Contains all properties needed for this table.
     */
    constructor(foodDiaryDaySummary) {
        /**
         * Summary of food consumption for a day.
         * @type {FoodDiaryDaySummary}
         */
        this.foodDiaryDaySummary = foodDiaryDaySummary;

        /**
         * Div for leu remaining
         * @type {Element}
         */
        this.leuRemainingDiv = null;

        /**
         * Div for leu consumed
         * @type {Element}
         */
        this.leuConsumedDiv = null;

        /**
         * Div for leu allowed
         * @type {Element}
         */
        this.leuAllowedDiv = null;

        /**
         * Div for calorie goal
         * @type {Element}
         */
        this.calorieGoalDiv = null;

        /**
         * Div for calorie consumed
         * @type {Element}
         */
        this.calorieConsumedDiv = null;

        /**
         * Div for calorie remaining
         * @type {Element}
         */
        this.calorieRemainingDiv = null;

        /**
         * Screen containing this element
         * @type {Element}
         */
        this.screen = null;

        /**
         * UI Element for this item
         * @type {Element}
         */
        this.uiElement = null;

        this._bindMethods();
    }

    /**
     * Initialize the UI for this widget
     * @param {Element} screen pointer to screen element on which to add this
     *            element
     * @param {string} template template for this item.
     */
    show(screen, template) {
        var me = this,
            summaries;

        this.screen = screen;
        this.uiElement = $("<div></div>")[0];

        this.uiElement.innerHTML = Utils.getHTMLBody(template);
        this.screen.appendChild(this.uiElement);

        $('head').append(Utils.getHTMLHeader(template));

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
    }

    /**
     * Refresh the view of this control, depending on the current state of
     * the day, etc.
     */
    refresh() {
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
    }

    /**
     * Add any event listeners
     * @private
     */
    _addListeners() {
        var me = this;
        me.foodDiaryDaySummary.leucineAmount.valueChanged.add(me.refresh);
        me.foodDiaryDaySummary.leucineAllowance.valueChanged
            .add(me.refresh);

        me.foodDiaryDaySummary.calorieAmount.valueChanged.add(me.refresh);
        me.foodDiaryDaySummary.calorieGoal.valueChanged.add(me.refresh);
    }

    /**
     * Remove event listeners
     * @private
     */
    _removeListeners() {
        var me = this;
        me.foodDiaryDaySummary.leucineAmount.valueChanged
            .remove(me.refresh);
        me.foodDiaryDaySummary.leucineAllowance.valueChanged
            .remove(me.refresh);

        me.foodDiaryDaySummary.calorieAmount.valueChanged
            .remove(me.refresh);
        me.foodDiaryDaySummary.calorieGoal.valueChanged.remove(me.refresh);
    }

    /**
     * Clean up this control.
     */
    destroy() {
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
    }

    /**
     * Bind Methods to "this", particularly ones that will be used by observers or callbacks.
     */
    _bindMethods() {
        var me = this;
        me.refresh = _.bind(me.refresh, me);
    }
}