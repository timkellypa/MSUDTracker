define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var Database = require("../Core/Database"),
        FoodCollection = require("./FoodCollection"),
        FoodDiaryEntryCollection = require("./FoodDiaryEntryCollection"),
        PersonalInfoCollection = require("./PersonalInfoCollection"),
        Utils = require("../Lib/Local/Utils"),
        _ = require("underscore"),
        AppDatabase;

    /**
     * App Database.  Extension of Core database, with shortcuts to pre-load initial data and register collections
     * unique to this app.
     *
     * @extends window.Core.Database
     * @constructor
     * @memberof window.Data
     * @param {string} dbName Database name
     * @param {array} foodInitialData initial data for Food collection
     * @param {array} foodDiaryEntryInitialData initial data for FoodDiaryEntry collection
     * @param {array} personalInfoInitialData initial data for PersonalInfo collection
     */
    AppDatabase = function (dbName, foodInitialData, foodDiaryEntryInitialData, personalInfoInitialData) {
        var foodCollection,
            foodDiaryEntryCollection,
            personalInfoCollection;

        AppDatabase.$Super.constructor.call(this, dbName);

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
    };

    AppDatabase.prototype =
    /** @lends window.Data.Food.prototype */
    {
        constructor: AppDatabase.prototype.constructor
    };

    Utils.inherit(AppDatabase, Database);

    return AppDatabase;
});