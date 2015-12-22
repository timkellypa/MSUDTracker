import IWidget from "../../../Core/UI/IWidget";
import _ from "underscore";

/**
 * A widget for displaying day summary
 */
export default class DaySummaryTable extends IWidget {
    /**
     * Constructs the DaySummaryTable widget
     * @constructor
     * @param {Object} options options for this widget constructor
     * @param {FoodDiaryDaySummary} options.context
     * food diary summary of the day. Contains all properties needed for this table.
     */
    constructor(options) {
        super();

        /**
         * Summary of food consumption for a day.
         * @type {DiarySummaryViewModel}
         */
        this.diarySummaryViewModel = options.context;

        /**
         * Div for leu remaining
         * @type {jQuery}
         */
        this.$leuRemaining = null;

        /**
         * Div for leu used
         * @type {jQuery}
         */
        this.$leuUsed = null;

        /**
         * Div for leu allowed
         * @type {jQuery}
         */
        this.$leuAllowed = null;

        /**
         * Div for calorie goal
         * @type {jQuery}
         */
        this.$calorieGoal = null;

        /**
         * Div for calorie consumed
         * @type {jQuery}
         */
        this.$calorieConsumed = null;

        /**
         * Div for calorie remaining
         * @type {jQuery}
         */
        this.$calorieRemaining = null;
    }

    /**
     * Initialize the UI for this widget
     * @param {Object} options options for this widget.
     */
    show(options) {
        let summaries;

        super.show(options);

        // Since we just appended this template, it will be the last one in
        // the container.
        summaries = this.$el.find(".day-summary-table");

        this.container = summaries[summaries.length - 1];

        this.$leuRemaining = this.$el.find(".leu-remaining-num");
        this.$leuUsed = this.$el.find(".leu-consumed-num");
        this.$leuAllowed = this.$el.find(".leu-allowed-num");

        this.$calorieGoal = this.$el.find(".calorie-goal-num");
        this.$calorieConsumed = this.$el.find(".calorie-consumed-num");
        this.$calorieRemaining = this.$el.find(".calorie-remaining-num");

        this.addListeners();

        this.refresh();
    }

    /**
     * Refresh the view of this control, depending on the current state of
     * the day, etc.
     */
    refresh() {
        var leuAllowed = this.diarySummaryViewModel.personalInfoViewModel.leucineAllowance.getValue(),
            leuAmount = this.diarySummaryViewModel.leucineAmount.getValue(),
            calorieGoal = this.diarySummaryViewModel.personalInfoViewModel.calorieGoal.getValue(),
            calorieAmount = this.diarySummaryViewModel.calorieAmount.getValue();

        this.$leuRemaining.html(leuAllowed - leuAmount);
        this.$leuUsed.html(leuAmount);
        this.$leuAllowed.html(leuAllowed);

        this.$calorieRemaining.html(calorieGoal - calorieAmount);
        this.$calorieConsumed.html(calorieAmount);
        this.$calorieGoal.html(calorieGoal);
    }

    /**
     * Add any event listeners
     * @private
     */
    addListeners() {
        this.diarySummaryViewModel.leucineAmount.valueChanged.add(this.refresh);
        this.diarySummaryViewModel.personalInfoViewModel.leucineAllowance.valueChanged
            .add(this.refresh);

        this.diarySummaryViewModel.calorieAmount.valueChanged.add(this.refresh);
        this.diarySummaryViewModel.personalInfoViewModel.calorieGoal.valueChanged.add(this.refresh);
    }

    /**
     * Remove event listeners
     * @private
     */
    removeListeners() {
        this.diarySummaryViewModel.leucineAmount.valueChanged.remove(this.refresh);
        this.diarySummaryViewModel.calorieAmount.valueChanged.remove(this.refresh);

        this.diarySummaryViewModel.personalInfoViewModel.leucineAllowance.valueChanged.remove(this.refresh);
        this.diarySummaryViewModel.personalInfoViewModel.calorieGoal.valueChanged.remove(this.refresh);
    }

    /**
     * Clean up this control.
     */
    destroy() {
        this.removeListeners();
        this.leuRemainingDiv = null;
        this.leuConsumedDiv = null;
        this.leuAllowedDiv = null;

        this.calorieGoalDiv = null;
        this.calorieConsumedDiv = null;
        this.calorieRemainingDiv = null;

        super.destroy();
    }

    /**
     * Bind Methods to "this", particularly ones that will be used by observers or callbacks.
     */
    bindMethods() {
        this.refresh = _.bind(this.refresh, this);
    }
}