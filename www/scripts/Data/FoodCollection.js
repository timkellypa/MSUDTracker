define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var IDataCollection = require("../Core/IDataCollection"),
        Food = require("./Food"),
        Utils = require("../Lib/Local/Utils"),
        _ = require("underscore"),
        FoodCollection;

    /*jslint unparam: true */

    /**
     * Stores food information, including leucine amount and calories per serving.
     *
     * @extends window.Core.IDataCollection
     * @constructor
     * @memberof window.Data
     * @param {window.Core.Database} database database to which this collection syncs.
     */
    FoodCollection = function (database) {
        FoodCollection.$Super.constructor.apply(this, arguments);
    };

    /*jslint unparam: false */

    _.extend(FoodCollection.prototype,
        /** @lends window.Data.FoodCollection.prototype */
        {
            getDbVersion: function() {
                return 1;
            },

            getDataObjectClass: function() {
                return Food;
            },

            getStoreName: function() {
                return "Food";
            },

            /**
             * Initialize the datastore for this data object.
             * @param event event object returned in the onupgradeneeded callback
             */
            createStore: function (event) {
                var e = event || {oldVersion: 0},
                    objectStore;
                if (!e.oldVersion || e.oldVersion < 1) {
                    objectStore = this.getDatabase().indexedDB.createObjectStore(this.getStoreName(),
                        {
                            keyPath: "id",
                            autoIncrement: false
                        });

                    objectStore.createIndex("id", "id", {unique: true});
                    objectStore.createIndex("description", "description", {unique: false});
                    objectStore.createIndex("weight", "weight", {unique: false});
                    objectStore.createIndex("serving", "serving", {unique: false});
                    objectStore.createIndex("unit", "unit", {unique: false});
                    objectStore.createIndex("leucineMg", "leucineMg", {unique: false});
                    objectStore.createIndex("energyKCal", "energyKCal", {unique: false});
                    objectStore.createIndex("isCustom", "isCustom", {unique: false});
                }
            }
        });

    Utils.inherit(FoodCollection, IDataCollection);

    return FoodCollection;
});