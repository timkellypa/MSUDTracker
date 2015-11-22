import IDataCollection from "../../Core/Data/IDataCollection";
import Database from "../../Core/Data/Database";
import FoodDiaryEntry from "./FoodDiaryEntry";
import FoodCollection from "./FoodCollection";
import DateHelpers from "../../Core/Lib/DateHelpers";
import Promise from "../../Core/Lib/Promise";

/*jslint unparam: true */

/**
 * Stores food information, including leucine amount and calories per serving.
 * @extends {IDataCollection}
 */
export default class FoodDiaryEntryCollection extends IDataCollection {
    /**
     * Construct a FoodDiaryEntryCollection
     * @param {Database} [database] database for this collection
     */
    constructor(database) {
        super(database);
    }

    /**
     * Get database version number
     * @returns {number}
     */
    getDbVersion() {
        return 1;
    }

    /**
     * Get data object class.
     * @returns {FoodDiaryEntry}
     */
    getDataObjectClass() {
        return FoodDiaryEntry;
    }

    /**
     * Get store name
     * @returns {string}
     */
    getStoreName() {
        return "FoodDiaryEntry";
    }

    /**
     * Initialize the datastore for this data object.
     * @param {Object} [event=Object()] event object returned in the onupgradeneeded callback.
     * Defaults to object with oldVersion = 0.
     */
    createStore(event = {oldVersion: 0}) {
        let objectStore;
        if (!event.oldVersion || event.oldVersion < 1) {
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
    }

    /**
     * Get food diary entries for a day.
     * @param {number} day epoch days
     * @param {IDBTransaction} [transaction=IDBTransaction()] IndexedDB transaction to latch onto
     * Default is a new transaction, with the necessary stores.
     * @returns {Promise} Promise with the entries array in the first argument
     */
    selectFoodDiaryEntriesForDay(day, transaction) {
        let that = this;
        return new Promise(
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
                    range = Database.getIDBKeyRange().bound(DateHelpers.getTimeFromEpochDay(day) - 1,
                        DateHelpers.getTimeFromEpochDay(day + 1)),
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
                        Promise.all(
                            includePromises
                        ).then(
                            function () {
                                resolve(foodDiaryEntries);
                            }
                        ).catch(
                            function (e) {
                                reject(e);
                            }
                        );
                    }
                };
            }
        );
    }
}