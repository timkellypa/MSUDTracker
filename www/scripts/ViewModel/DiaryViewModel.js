
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var ObservableVar = require("Core/ObservableVar"),
        Database = require("Core/Database"),
        Config = require("Config"),
        Utils = require("Lib/Local/Utils"),
        FoodDiaryDaySummary = require("ViewModel/Classes/FoodDiaryDaySummary"),
        FoodCollection = require("Data/FoodCollection"),
        FoodDiaryEntryCollection = require("Data/FoodDiaryEntryCollection"),
        PersonalInfoCollection = require("Data/PersonalInfoCollection"),
        _ = require("underscore"),
        DiaryViewModel;

    /**
     * Class containing the information we need to store a diary,
     *      specifically the current day, and the foods consumed that day.
     * @constructor
     * @memberof window.ViewModel
     * @param {number} [day] day with which to initialize view model.  Will default to epoch day for today.
     **/
    DiaryViewModel = function (day) {
        var curDay,
            today;

        this.isLoading = new ObservableVar(true);

        today = Utils.getEpochDayFromTime((new Date()).getTime());
        curDay = typeof day === "number" ? day : today;
        this.currentDay = new ObservableVar(curDay);
        this.dayPickerMinValue = new ObservableVar(0);
        this.dayPickerMaxValue = new ObservableVar(today);
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
        personalInfoCollection: null,

        /**
         * Initialize view model
         */
        init: function () {
            var db,
                that = this;

            db = new Database(Config.Globals.databaseName);
            this.foodCollection = new FoodCollection(db);
            this.foodDiaryEntryCollection = new FoodDiaryEntryCollection(db);
            this.personalInfoCollection = new PersonalInfoCollection(db);

            this.foodDiaryDaySummary = new FoodDiaryDaySummary(
                this.currentDay,
                this.foodDiaryEntryCollection,
                this.personalInfoCollection
            );

            this._bindMethods();
            this._addListeners();

            return db.init()
                .then(this.foodDiaryDaySummary.loadInfo)
                .finally(
                function () {
                    that.checkLoad();
                }
            );
        },

        _addListeners: function () {
            this.foodDiaryDaySummary.isLoading.valueChanged.add(this.checkLoad);
        },

        _removeListeners: function () {
            this.foodDiaryDaySummary.isLoading.valueChanged.remove(this.checkLoad);
        },

        destroy: function () {
            this._removeListeners();
            this.foodCollection = null;
            this.foodDiaryEntryCollection = null;
            this.personalInfoCollection = null;

            this.foodDiaryDaySummary.destroy();
            this.foodDiaryDaySummary = null;

            this.isLoading = null;

            this.currentDay = null;
            this.dayPickerMinValue = null;
            this.dayPickerMaxValue = null;
        },

        _bindMethods: function () {
            var that = this;
            that.checkLoad = _.bind(that.checkLoad, that);
        },

        checkLoad: function () {
            // If there are other classes, make this an AND of all their loading values
            this.isLoading.setValue(this.foodDiaryDaySummary.isLoading.getValue());
        }
    };

    return DiaryViewModel;
});