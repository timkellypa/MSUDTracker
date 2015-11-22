import IDataCollection from "../../Core/Data/IDataCollection.js";
import PersonalInfo from "./PersonalInfo";

/**
 * Stores Personal information, Contains leucine allowance and calorie goal
 * @extends {IDataCollection}
 */
export default class PersonalInfoCollection extends IDataCollection {
    /**
     * Constructs a PersonalInfoCollection
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
     * @returns {PersonalInfo}
     */
    getDataObjectClass() {
        return PersonalInfo;
    }

    /**
     * Get store name
     * @returns {string}
     */
    getStoreName() {
        return "PersonalInfo";
    }

    /**
     * Initialize the datastore for this data object.
     * @param {Object} event event object returned in the onupgradeneeded callback
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
            objectStore.createIndex("leucineAllowance", "leucineAllowance", {unique: false});
            objectStore.createIndex("calorieGoal", "calorieGoal", {unique: false});
        }
    }
}