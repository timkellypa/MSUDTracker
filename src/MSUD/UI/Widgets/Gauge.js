import IWidget from "../../../Core/UI/IWidget";
import ObservableVar from "../../../Core/ObservableVar";
import _ from "underscore";
import $ from "jquery";

/**
 * A widget for creating a meter to show the amount of something left. Takes
 * in observable variables for the total amount and the used amount of a
 * thing.
 **/
export default class Gauge extends IWidget {
    /**
     * Construct a Gauge
     * @param {Object} options options for this control.
     * @param {ObservableVar} [options.total=new ObservableVar()] total amount allowed.
     * @param {ObservableVar} [options.amount=new ObservableVar()] current amount used.
     * @param {string} [options.sizeProperty="height"] CSS property to change by a
     *            percentage to show the meter's fullness
     */
    constructor(options) {
        super(options);

        /**
         * Variable containing the total amount allowed
         * @type {ObservableVar}
         */
        this.total = options.total || new ObservableVar(null);

        /**
         * Variable containing the total amount used
         * @type {ObservableVar}
         */
        this.amount = options.amount || new ObservableVar(null);

        /**
         * CSS property to change by a percentage to show the meter's fullness
         * @type {string}
         */
        this.sizeProperty = options.sizeProperty || "height";

        /**
         * Div containing the outer part of the meter
         * @type {jQuery}
         */
        this.$gauge = null;

        /**
         * Div in which we change the height to a percentage to fill a meter
         * @type {jQuery}
         */
        this.$filler = null;

        this.bindMethods();
    }

    /**
     * Initialize the UI for this widget
     */
    show(options) {
        super.show(options);

        // Since we just appended this template, it will be the last one in
        // the container.
        this.$gauge = this.$el.find(".gauge");

        this.$filler = this.$el.find(".filler");
        this.addListeners();
        this.refresh();
    }

    /**
     * Refresh the view of this control, depending on the current state of
     * the day, etc.
     */
    refresh() {
        var total = this.total.getValue(), amount = this.amount
            .getValue(), percent = ((parseFloat(total - amount)) / total) * 100.0;

        this.$filler.height(`${percent}%`);
    }

    /**
     * Add event listeners
     */
    addListeners() {
        this.total.valueChanged.add(this.refresh);
        this.amount.valueChanged.add(this.refresh);
    }

    /**
     * Remove event listeners
     */
    removeListeners() {
        this.total.valueChanged.remove(this.refresh);
        this.amount.valueChanged.remove(this.refresh);
    }

    /**
     * Clean up this control.
     */
    destroy() {
        this.removeListeners();
        super.destroy();
    }

    /**
     * Bind Methods to "this", particularly ones that will be used by observers or callbacks.
     */
    bindMethods() {
        this.refresh = _.bind(this.refresh, this);
    }
}