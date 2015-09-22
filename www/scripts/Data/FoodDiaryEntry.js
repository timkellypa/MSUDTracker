
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*globals IDBKeyRange:true */
define(function (require) {
    "use strict";
    var IDataObject = require("../Core/IDataObject"),
        Utils = require("../Lib/Local/Utils"),
        Food = require("./Food"),
        FoodDiaryEntry;

    /**
     * A food diary entry.  Describes when a person ate a particular food, how many servings, etc.
     * @constructor
     * @memberof window.Data
     * @extends window.Core.IDataObject
     * @param {Object} obj
     * @param {int} obj.id
     * @param {int} obj.foodID
     * @param {int} obj.enteredTime
     * @param {int} obj.eatenTime
     * @param {int} obj.servings
     * @param {int} obj.mealID
     * @param {window.Core.IDataCollection} collection data collection containing this object.
     */
    FoodDiaryEntry = function (obj, collection) {
        FoodDiaryEntry.$Super.constructor.call(this, obj, collection);
    };

    FoodDiaryEntry.prototype =
    /** @lends window.Data.FoodDiaryEntry.prototype */
    {
        constructor: FoodDiaryEntry.prototype.constructor,

        /**
         * Name of the store
         * @type string
         */
        storeName: "FoodDiaryEntry",


        /**
         * Get the foreign keys associated with this object
         * @returns {Array.<{foreignKey: string, foreignClass: function(new:window.Core.DataObject, {obj: Object})}>}
         */
        getForeignKeys: function() {
            return [{foreignKey: "foodID", foreignClass: Food}];
        },

        /**
         * id
         * @type int
         */
        id: null,

        /**
         * food id.  Used to populate "Food" field (foreign key to food table)
         * @type int
         */
        foodID: null,

        /**
         * Javascript "getDate()" time that food was entered
         * @type int
         */
        enteredTime: null,

        /**
         * Javascript "getDate()" time that food was eaten
         * @type int
         */
        eatenTime: null,

        /**
         * Number of servings eaten
         * @type int
         */
        servings: null,

        /**
         * id of the meal.
         */
        mealID: null,

        /**
         * Value of inner join'ed food object (by food ID)
         * @type window.Data.Food
         */
        Food: null
    };
    Utils.inherit(FoodDiaryEntry, IDataObject);

    return FoodDiaryEntry;
});