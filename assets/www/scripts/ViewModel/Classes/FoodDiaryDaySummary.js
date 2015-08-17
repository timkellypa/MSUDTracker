/**
 * @typedef window.ViewModel.Classes.FoodDiaryDaySummary
 * @name window.ViewModel.Classes.FoodDiaryDaySummary
 * @ignore
 */

define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    var ObservableVar = require("Core/ObservableVar"),
        Utils = require("Lib/Local/Utils"),
        _ = require("underscore"),
        FoodDiaryDaySummary;

    /**
     * An object containing observable summary information for food eaten on a particular day.
     * @constructor
     * @memberof window.ViewModel.Classes
     * @param {window.Core.ObservableVar} [day = new ObservableVar(Utils.getEpochDayFromTime((new Date()).getTime()))]
     * Current observable variable containing the day.  Makes a new one if one doesn't exist.
     * @param {window.Data.FoodDiaryEntryCollection} foodDiaryEntryCollection collection of diary entries.
     * @param {window.Data.PersonalInfoCollection} personalInfoCollection collection containing personal info entry.
     */
    FoodDiaryDaySummary = function (day, foodDiaryEntryCollection, personalInfoCollection) {
        // Establish observable variables for summary information
        this.day = day || new ObservableVar(Utils.getEpochDayFromTime((new Date()).getTime()));
        this.leucineAmount = new ObservableVar(0);
        this.calorieAmount = new ObservableVar(0);
        this.calorieGoal = new ObservableVar(0);
        this.leucineAllowance = new ObservableVar(0);
        this.foodDiaryEntries = new ObservableVar([]);
        this.foodDiaryEntryCollection = foodDiaryEntryCollection;
        this.personalInfoCollection = personalInfoCollection;

        this._bindMethods();
        this._addListeners();
    };

    _.extend(FoodDiaryDaySummary.prototype,
        /** @lends window.ViewModel.Classes.FoodDiaryDaySummary.prototype */
        {
            /**
             * Current day of our data
             * @type window.Core.ObservableVar
             */
            day: null,

            /**
             * Amount of leucine taken this day
             * @type window.Core.ObservableVar
             */
            leucineAmount: null,

            /**
             * Total calories for the day
             * @type window.Core.ObservableVar
             */
            calorieAmount: null,

            /**
             * Daily calorie goal
             * @type window.Core.ObservableVar
             */
            calorieGoal: null,

            /**
             * Daily leucine allowance
             * @type window.Core.ObservableVar
             */
            leucineAllowance: null,

            /**
             * Entries of FoodDiary for the day.  Observable var containing Data.FoodDiaryEntry array.
             * @type window.Core.ObservableVar
             */
            foodDiaryEntries: null,

            /**
             * Collection containing all FoodDiaryEntry objects.
             * @type window.Data.FoodDiaryEntryCollection
             */
            foodDiaryEntryCollection: null,

            /**
             * Collection containing single PersonalInfo object.
             * @type window.Data.PersonalInfoCollection
             */
            personalInfoCollection: null,

            /**
             * Create listeners
             */
            _addListeners: function () {
                this.day.valueChanged.add(this.loadDaySummary);
            },

            /**
             * Remove listeners
             */
            _removeListeners: function () {
                this.day.valueChanged.remove(this.loadDaySummary);
            },

            /**
             * Bind global methods to "this" instance.
             * Particularly useful for functions that are added to listeners
             * and may not have the proper scope when called otherwise.
             */
            _bindMethods: function () {
                var me = this;
                me.loadInfo = _.bind(me.loadInfo, me);
                me.loadGoals = _.bind(me.loadGoals, me);
                me.loadDaySummary = _.bind(me.loadDaySummary, me);
            },

            /**
             * Calculate food summary
             * Utility function for resetting our amount values for a day.
             * Private to ensure that no caller thinks that this will also load the data for the day.
             */
            _calculateFoodSummary: function () {
                var entries,
                    totalLeucine = 0,
                    totalCalories = 0,
                    iNdx,
                    curEntry;

                if (this.foodDiaryEntries === null) {
                    return;
                }

                entries = this.foodDiaryEntries.getValue();
                for (iNdx = 0; iNdx < entries.length; ++iNdx) {
                    curEntry = entries[iNdx];
                    totalLeucine += curEntry.Food.leucineMg * curEntry.servings;
                    totalCalories += curEntry.Food.energyKCal * curEntry.servings;
                }

                this.leucineAmount.setValue(totalLeucine);
                this.calorieAmount.setValue(totalCalories);
            },

            /**
             * Load summary for the day.  Load all foods and store them in foodDiaryEntries.
             * Then calculate the food summary.
             * @returns {Promise}
             */
            loadDaySummary: function () {
                var that = this;

                return this.foodDiaryEntryCollection.selectFoodDiaryEntriesForDay(this.day.getValue(),
                                                                                  null)
                    .then(function (foodDiaryEntries) {
                              that.foodDiaryEntries.setValue(foodDiaryEntries);
                              that._calculateFoodSummary();
                          });
            },

            /**
             * Load our goals from personal info.
             * @returns {Promise}
             */
            loadGoals: function () {
                var that = this;

                return Utils.createPromise(function (resolve, reject) {
                    that.personalInfoCollection.getItemById(1, null)
                        .then(
                        function (personalInfo) {
                            that.leucineAllowance.setValue(personalInfo.leucineAllowance);
                            that.calorieGoal.setValue(personalInfo.calorieGoal);
                            resolve();
                        },
                        function (e) {
                            reject(e);
                        }
                    );
                });
            },

            /**
             * Load diary info
             * @returns {Promise}
             */
            loadInfo: function () {
                var that = this;
                return Utils.createPromise(function (resolve, reject) {
                    that.loadGoals()
                        .then(that.loadDaySummary)
                        .then(
                        function () {
                            resolve();
                        },
                        function () {
                            reject();
                        }
                    );
                });
            },

            /**
             * Clean up this object
             */
            destroy: function () {
                var me = this;
                me._removeListeners();
                me.day = null;
                me.leucineAmount = null;
                me.calorieAmount = null;
                me.leucineAllowance = null;
                me.foodDiaryEntries = null;
            }
        }
    );
    return FoodDiaryDaySummary;
});