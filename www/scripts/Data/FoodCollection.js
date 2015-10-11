import IDataCollection from "../Core/Data/IDataCollection";
import Food from "./Food";

/**
 * Stores food information, including leucine amount and calories per serving.
 * @extends {IDataCollection}
 */
export default class FoodCollection extends IDataCollection {
    /**
     * Constructs a food collection.
     * @param {Database} [database] database to which this collection syncs.
     */
    constructor(database) {
        super(database);
    }

    /**
     * Get database version required for this collection
     * @returns {number}
     */
    getDbVersion() {
        return 1;
    }

    /**
     * Get the object for a single model of this collection.
     * @returns {Food}
     */
    getDataObjectClass() {
        return Food;
    }

    /**
     * Get the store name for this collection
     * @returns {string}
     */
    getStoreName() {
        return "Food";
    }

    /**
     * Initialize the datastore for this data object.
     * @param {Object} event object returned in the onupgradeneeded callback
     */
    createStore(event) {
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
}