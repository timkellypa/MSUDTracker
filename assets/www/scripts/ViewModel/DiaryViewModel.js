define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var ObservableVar = require("Core/ObservableVar"),
        Database = require("Core/Database"),
        Callback = require("Core/Callback"),
        Config = require("Config"),
        Utils = require("Lib/Local/Utils"),
        FoodDiaryDaySummary = require("ViewModel/Classes/FoodDiaryDaySummary"),
        FoodCollection = require("Data/FoodCollection"),
        FoodDiaryEntryCollection = require("Data/FoodDiaryEntryCollection"),
        PersonalInfoCollection = require("Data/PersonalInfoCollection"),
        FoodData = require("text!Data/Bootstrap/FoodData.json"),
        FoodDiaryEntryData = require("text!Data/Bootstrap/Test/FoodDiaryEntryData.json"),
        PersonalInfoData = require("text!Data/Bootstrap/Test/PersonalInfoData.json"),
        _ = require("underscore"),
        context = null,
        DiaryViewModel;

    /**
     * Singleton containing the information we need to store a diary,
     *      specifically the current day we are looking at, and the foods consumed that day.
     * @constructor
     * @memberof window.ViewModel
     *
     **/
    DiaryViewModel = function () {
        var today,
            db,
            initCB,
            foodCollection,
            foodDiaryEntryCollection,
            personalInfoCollection;
        // Ensure only one instance of this at a time.
        if (context !== null) {
            return context;
        }
        context = this;

        this.isLoading = new ObservableVar(false);
        this.isLoading.setValue(true);

        today = Utils.getEpochDayFromTime((new Date()).getTime());
        this.currentDay = new ObservableVar(today);
        this.dayPickerMinValue = new ObservableVar(0);
        this.dayPickerMaxValue = new ObservableVar(today);

        this.foodDiaryDaySummary = new FoodDiaryDaySummary(this.currentDay, this);

        // Initialize data and database

        db = new Database(Config.Globals.databaseName);
        this.foodCollection = new FoodCollection(db);
        this.foodDiaryEntryCollection = new FoodDiaryEntryCollection(db);
        this.personalInfoCollection = new PersonalInfoCollection(db);
        this.foodCollection.setInitialData(JSON.parse(FoodData));
        if (Config.Globals.loadTestData) {
            this.foodDiaryEntryCollection.setInitialData(JSON.parse(FoodDiaryEntryData));
            this.personalInfoCollection.initialData = JSON.parse(PersonalInfoData);
        }
        initCB = new Callback(_.bind(function () {
                                  var foodDataCB = new Callback(
                                      _.bind(function () {
                                          this.isLoading.setValue(false);
                                      }, this),
                                      function (errorObj) {
                                          throw errorObj;
                                      }
                                  );
                                  this.foodDiaryDaySummary.loadInfo(foodDataCB);
                              }, this),
                              function (errorObj) {
                                  throw errorObj;
                              }
        );
        db.init(initCB);
    };

    DiaryViewModel.prototype =
    /** @lends window.ViewModel.DiaryViewModel.prototype */
    {
        constructor: DiaryViewModel.prototype.constructor,

        /**
         * Whether or not the view model is currently in a state of loading.
         * @type window.Core.ObservableVar
         */
        isLoading: null,

        /**
         * Current day (value of day picker, typically)
         * @type window.Core.ObservableVar
         */
        currentDay: null,

        /**
         * Day Toolbar minimum value
         * @type window.Core.ObservableVar
         */
        dayPickerMinValue: null,
        /**
         * Day Toolbar maximum value
         * @type window.Core.ObservableVar
         */
        dayPickerMaxValue: null,

        /**
         * Summary of food diary information
         * @type window.Core.ObservableVar
         */
        foodDiaryDaySummary: null,

        /**
         * Food collection
         * @type window.Data.FoodCollection
         */
        foodCollection: null,

        /**
         * FoodDiaryEntry collection
         * @type window.Data.FoodDiaryEntryCollection
         */
        foodDiaryEntryCollection: null,

        /**
         * PersonalInfo Collection
         * @type window.Data.PersonalInfoCollection
         */
        personalInfoCollection: null
    };

    return DiaryViewModel;
});