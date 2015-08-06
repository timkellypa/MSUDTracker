define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function(require) {
    "use strict";
    var $ = require("jquery"), _ = require("underscore"), Gauge;

    /**
     * A widget for creating a meter to show the amount of something left. Takes
     * in observable variables for the total amount and the used amount of a
     * thing.
     * 
     * @constructor
     * @memberof window.UI.Widgets
     * @param {window.Core.ObservableVar}
     *            total total amount allowed.
     * @param {window.Core.ObservableVar}
     *            amount current amount used.
     * @param {string}
     *            [sizeProperty = "height"] CSS property to change by a
     *            percentage to show the meter's fullness
     */
    Gauge = function(total, amount, sizeProperty) {
        var sp = sizeProperty || "height";
        this.total = total;
        this.amount = amount;
        this.sizeProperty = sp;
        this._bindMethods();
    };

    Gauge.prototype =
    /** @lends window.UI.Widgets.Gauge.prototype */
    {
        constructor: Gauge.prototype.constructor,

        /**
         * Variable containing the total amount allowed
         * 
         * @type window.Core.ObservableVar
         */
        total: null,

        /**
         * Variable containing the total amount used
         * 
         * @type window.Core.ObservableVar
         */
        amount: null,

        /**
         * CSS property to change by a percentage to show the meter's fullness
         * 
         * @type string
         */
        sizeProperty: null,

        /**
         * Div in which we change the height to a percentage to fill a meter
         * 
         * @type Element
         */
        fillerDiv: null,

        /**
         * Initialize the UI for this widget
         * 
         * @param {Element}
         *            screen pointer to screen element on which to add this
         *            element
         * @param {string}
         *            template template for this item.
         * @param {string}
         *            [headerExt = null] Extra HTML that needs to be added to
         *            the header for this widget to work/look right. (e.g. style
         *            tags)
         */
        show: function(screen, template, headerExt) {
            var me = this, newElement = $("<div></div>")[0], gauges;

            newElement.innerHTML = template;
            screen.appendChild(newElement);

            if (typeof headerExt === "string") {
                $('head').append(headerExt);
            }

            // Since we just appended this template, it will be the last one in
            // the container.
            gauges = $(screen).find(".Gauge");
            me.container = gauges[gauges.length - 1];
            me.fillerDiv = $(this.container).find(".Filler")[0];
            me._addListeners();
            me.refresh();
        },

        /**
         * Refresh the view of this control, depending on the current state of
         * the day, etc.
         */
        refresh: function() {
            var me = this, total = me.total.getValue(), amount = me.amount
                    .getValue(), percent = ((parseFloat(total - amount)) / total) * 100.0;

            me.fillerDiv.style.height = percent + "%";
        },

        _addListeners: function() {
            var me = this;
            me.total.valueChanged.add(me.refresh);
            me.amount.valueChanged.add(me.refresh);
        },

        _removeListeners: function() {
            var me = this;
            me.total.valueChanged.remove(me.refresh);
            me.amount.valueChanged.remove(me.refresh);
        },

        /**
         * Clean up this control.
         */
        destroy: function() {
            var me = this;
            me.removeListeners();
            me.container = null;
            me.fillerDiv = null;
        },

        /**
         * Bind Methods to "this", particularly ones that will be used by observers or callbacks.
         */
        _bindMethods: function() {
            var me = this;
            me.refresh = _.bind(me.refresh, me);
        }
    };

    return Gauge;
});