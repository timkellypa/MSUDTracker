import Utils from "../../Lib/Local/Utils";
import _ from "underscore";
import $ from "jquery";

/**
 * A widget for creating a meter to show the amount of something left. Takes
 * in observable variables for the total amount and the used amount of a
 * thing.
 **/
export default class Gauge {
    /**
     *
     * @constructor
     * @memberof window.UI.Widgets
     * @param {window.Core.ObservableVar} total total amount allowed.
     * @param {window.Core.ObservableVar} amount current amount used.
     * @param {string} [sizeProperty = "height"] CSS property to change by a
     *            percentage to show the meter's fullness
     */
    constructor(total, amount, sizeProperty) {
        var sp = sizeProperty || "height";

        /**
         * Variable containing the total amount allowed
         *
         * @type window.Core.ObservableVar
         */
        this.total = total;

        /**
         * Variable containing the total amount used
         *
         * @type window.Core.ObservableVar
         */
        this.amount = amount;

        /**
         * CSS property to change by a percentage to show the meter's fullness
         *
         * @type string
         */
        this.sizeProperty = sp;

        /**
         * Div in which we change the height to a percentage to fill a meter
         *
         * @type Element
         */
        this.fillerDiv = null;

        /**
         * Screen container for this element
         * @type Element
         */
        this.screen = null;

        /**
         * UI element for this widget
         * @type Element
         */
        this.uiElement = null;


        this._bindMethods();
    }

;


    /**
     * Initialize the UI for this widget
     *
     * @param {Element} screen pointer to screen element on which to add this
     *            element
     * @param {string} template template for this item
     */
    show(screen, template) {
        var me = this,
            gauges;

        this.screen = screen;
        this.uiElement = $("<div></div>")[0];

        this.uiElement.innerHTML = Utils.getHTMLBody(template);
        this.screen.appendChild(this.uiElement);

        $('head').append(Utils.getHTMLHeader(template));

        // Since we just appended this template, it will be the last one in
        // the container.
        gauges = $(screen).find(".Gauge");
        me.container = gauges[gauges.length - 1];
        me.fillerDiv = $(this.container).find(".Filler")[0];
        me._addListeners();
        me.refresh();
    }

;

    /**
     * Refresh the view of this control, depending on the current state of
     * the day, etc.
     */
    refresh() {
        var me = this, total = me.total.getValue(), amount = me.amount
            .getValue(), percent = ((parseFloat(total - amount)) / total) * 100.0;

        me.fillerDiv.style.height = percent + "%";
    }

;

    _addListeners() {
        var me = this;
        me.total.valueChanged.add(me.refresh);
        me.amount.valueChanged.add(me.refresh);
    }

;

    _removeListeners() {
        var me = this;
        me.total.valueChanged.remove(me.refresh);
        me.amount.valueChanged.remove(me.refresh);
    }

;

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
        me.fillerDiv = null;
    }

;

    /**
     * Bind Methods to "this", particularly ones that will be used by observers or callbacks.
     */
    _bindMethods() {
        var me = this;
        me.refresh = _.bind(me.refresh, me);
    }

;

};