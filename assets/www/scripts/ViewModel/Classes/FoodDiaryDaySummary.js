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
        Callback = require("Core/Callback"),
        ErrorObj = require("Core/ErrorObj"),
        _ = require("underscore"),
        FoodDiaryDaySummary;

    /**
     * An object containing observable summary information for food eaten on a particular day.
     * @constructor
     * @memberof window.ViewModel.Classes
     * @param {window.Core.ObservableVar} [day = new ObservableVar(Utils.getEpochDayFromTime((new Date()).getTime()))]
     * Current observable variable containing the day.  Makes a new one if one doesn't exist.
     * @param {window.ViewModel.DiaryViewModel} context ViewModel context for this object.
     */
    FoodDiaryDaySummary = function (day, context) {
        // Establish observable variables for summary information
        this.day = day || new ObservableVar(Utils.getEpochDayFromTime((new Date()).getTime()));
        this.leucineAmount = new ObservableVar(0);
        this.calorieAmount = new ObservableVar(0);
        this.calorieGoal = new ObservableVar(0);
        this.leucineAllowance = new ObservableVar(0);
        this.foodDiaryEntries = new ObservableVar([]);

        this._getContext = function () {
            return context;
        };

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
             * Get DiaryViewModel context
             * @returns {window.ViewModel.DiaryViewModel}
             */
            _getContext: function () {
                throw new ErrorObj(ErrorObj.Codes.UnInitializedObjectException,
                                   "Attempt to get context from uninitialized object",
                                   new Error());
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
             * @param {window.Core.Callback} [callback = new Callback()] Callback for this function
             */
            loadDaySummary: function (callback) {
                var cb = callback instanceof Callback ? callback : new Callback(),
                    foodDiaryEntriesCB,
                    context = this._getContext();

                foodDiaryEntriesCB = new Callback(
                    _.bind(function (foodDiaryEntries) {
                        this.foodDiaryEntries.setValue(foodDiaryEntries);
                        this._calculateFoodSummary();
                        cb.success();
                    }, this),
                    cb.error
                );

                context.foodDiaryEntryCollection.selectFoodDiaryEntriesForDay(this.day.getValue(),
                                                                                         null,
                                                                                         foodDiaryEntriesCB);
            },

            /**
             * Load our goals from personal info.
             * @param {window.Core.Callback} [callback = new Callback()] Callback for this function
             */
            loadGoals: function (callback) {
                var cb = callback || new Callback(),
                    personalInfoCB;

                personalInfoCB = new Callback(
                    _.bind(function (personalInfo) {
                        this.leucineAllowance.setValue(personalInfo.leucineAllowance);
                        this.calorieGoal.setValue(personalInfo.calorieGoal);
                        cb.success();
                    }, this),
                    cb.error
                );


                this._getContext().personalInfoCollection.getItemById(1, null, personalInfoCB);
            },

            /**
             * Load diary info
             * @param {window.Core.Callback} [callback = new Callback()] Callback for this function
             */
            loadInfo: function (callback) {
                var cb = callback || new Callback(),
                    goalCB;

                goalCB = new Callback(_.bind(function () {
                                          this.loadDaySummary(cb);
                                      }, this),
                                      function (e) {
                                          cb.error(e);
                                      }
                );
                this.loadGoals(goalCB);
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

                // Remove closure reference to ViewModel.
                this._getContext = function () {
                    return null;
                };
            }
        }
    );
    return FoodDiaryDaySummary;
});