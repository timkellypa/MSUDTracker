define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*global IDBKeyRange: false */
define(function (require) {
    "use strict";
    var IDataCollection = require("../Core/IDataCollection"),
        FoodDiaryEntry = require("./FoodDiaryEntry"),
        FoodCollection = require("./FoodCollection"),
        Utils = require("../Lib/Local/Utils"),
        Promise = Utils.getPromiseLib(),
        _ = require("underscore"),
        FoodDiaryEntryCollection;

    /*jslint unparam: true */

    /**
     * Stores food information, including leucine amount and calories per serving.
     *
     * @extends window.Core.IDataCollection
     * @constructor
     * @memberof window.Data
     * @param {window.Core.Database} database database to which this collection syncs.
     */
    FoodDiaryEntryCollection = function (database) {
        FoodDiaryEntryCollection.$Super.constructor.apply(this, arguments);
    };

    /*jslint unparam: false */

    _.extend(FoodDiaryEntryCollection.prototype,
        /** @lends window.Data.FoodDiaryEntryCollection.prototype */
        {
            getDbVersion: function () {
                return 3;
            },

            getDataObjectClass: function () {
                return FoodDiaryEntry;
            },

            getStoreName: function () {
                return "FoodDiaryEntry";
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
                    objectStore.createIndex("foodID", "foodID", {unique: false});
                    objectStore.createIndex("enteredTime", "enteredTime", {unique: false});
                    objectStore.createIndex("eatenTime", "eatenTime", {unique: false});
                    objectStore.createIndex("servings", "servings", {unique: false});
                    objectStore.createIndex("mealID", "mealID", {unique: false});
                }
            },

            /**
             * Get food diary entries for a day.
             * @param {int} day epoch days
             * @param {IDBTransaction} transaction IndexedDB transaction to latch onto
             * Optional: Default is a new transaction
             */
            selectFoodDiaryEntriesForDay: function (day, transaction) {
                var that = this;
                return Utils.createPromise(
                    function (resolve, reject) {
                        var
                            trans = transaction || that.getDatabase().indexedDB.transaction([
                                        "FoodDiaryEntry",
                                        "Food"
                                    ],
                                    "readonly"),
                            includePromises = [],
                            foodDiaryEntries = [],
                            store = trans.objectStore(that.getStoreName()),
                            range = that.getDatabase().getIDBKeyRange().bound(Utils.getTimeFromEpochDay(day) - 1,
                                                                              Utils.getTimeFromEpochDay(day + 1)),
                            index = store.index('eatenTime'),
                            cursor = index.openCursor(range);

                        cursor.onsuccess = function (event) {
                            var curCursor = event.target.result,
                                curFoodEntry;

                            if (curCursor !== null) {
                                curFoodEntry = new FoodDiaryEntry(curCursor.value, that);
                                foodDiaryEntries.push(curFoodEntry);

                                includePromises.push(curFoodEntry.include(trans,
                                                                          "foodID",
                                                                          new FoodCollection(that.getDatabase())));

                                curCursor["continue"]();
                            }
                            else {
                                Promise.all(includePromises)
                                    .then(
                                    function () {
                                        resolve(foodDiaryEntries);
                                    })
                                    .catch(
                                    function (e) {
                                        reject(e);
                                    }
                                );
                            }
                        };
                    }
                );
            }
        });

    Utils.inherit(FoodDiaryEntryCollection, IDataCollection);

    return FoodDiaryEntryCollection;
});