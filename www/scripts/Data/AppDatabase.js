import Database from "../Core/Database";
import FoodCollection from "./FoodCollection";
import FoodDiaryEntryCollection from "./FoodDiaryEntryCollection";
import PersonalInfoCollection from "./PersonalInfoCollection";
import _ from "underscore";

/**
 * App Database.  Extension of Core database, with shortcuts to pre-load initial data and register collections
 * unique to this app.
 * @extends {Database}
 */
export default class AppDatabase extends Database {

    /**
     * Constructs a Database object with collections specific to the app,
     * along with any initial data that is passed in.
     * @param {string} dbName Database name
     * @param {Array} foodInitialData initial data for Food collection
     * @param {Array} foodDiaryEntryInitialData initial data for FoodDiaryEntry collection
     * @param {Array} personalInfoInitialData initial data for PersonalInfo collection
     */
    constructor(dbName, foodInitialData, foodDiaryEntryInitialData, personalInfoInitialData) {
        let foodCollection,
            foodDiaryEntryCollection,
            personalInfoCollection;

        super(dbName);

        foodCollection = new FoodCollection(this);
        foodDiaryEntryCollection = new FoodDiaryEntryCollection(this);
        personalInfoCollection = new PersonalInfoCollection(this);

        if (_.isArray(foodInitialData)) {
            foodCollection.setInitialData(foodInitialData);
        }

        if (_.isArray(foodDiaryEntryInitialData)) {
            foodDiaryEntryCollection.setInitialData(foodDiaryEntryInitialData);
        }

        if (_.isArray(personalInfoInitialData)) {
            personalInfoCollection.setInitialData(personalInfoInitialData);
        }
    }
}