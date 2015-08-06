define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var IDataObject = require("../Core/IDataObject"),
        Utils = require("../Lib/Local/Utils"),
        Food;

    /**
     * Stores food information, including leucine amount and calories per serving.
     *
     * @extends window.Core.IDataObject
     * @constructor
     * @memberof window.Data
     * @param {Object} obj
     * @param {int} obj.id
     * @param {string} obj.description
     * @param {int} obj.weight
     * @param {int} obj.serving
     * @param {int} obj.unit
     * @param {int} obj.leucineMg
     * @param {int} obj.energyKCal
     * @param {boolean} [obj.isCustom = false]
     * @param {window.Data.FoodCollection} collection data collection containing this object.
     */
    Food = function (obj, collection) {
        Food.$Super.constructor.call(this, obj, collection);
    };

    Food.prototype =
    /** @lends window.Data.Food.prototype */
    {
        constructor: Food.prototype.constructor,

        /**
         * Store Name
         * @type string
         */
        storeName: "Food",

        /**
         * ID of this item.  Keep null for new entries, otherwise will auto-increment.
         * Must set to the correct value for updates.
         * @type int
         */
        id: null,

        /**
         * Description
         * @type string
         */
        description: null,

        /**
         * Weight
         * @type int
         */
        weight: null,

        /**
         * Serving size
         * @type int
         */
        serving: null,


        /**
         * Unit of measurement for the food
         * @type string
         */
        unit: null,


        /**
         * Milligrams of leucine
         * @type int
         */
        leucineMg: null,

        /**
         * Calories
         * @type int
         */
        energyKCal: null,

        /**
         * Whether or not this item was custom (i.e. created by the user).
         * @type boolean
         */
        isCustom: null
    };

    Utils.inherit(Food, IDataObject);

    return Food;
});