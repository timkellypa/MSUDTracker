import ObservableVar from "Core/ObservableVar";
import Utils from "Lib/Local/Utils";
import _ from "underscore";

/**
 * An object containing observable summary information for food eaten on a particular day.
 */
export default class FoodDiaryDaySummary {
    /**
     * Construct the FoodDiaryDaySummary object.  Establishes observable variables.
     * @param {ObservableVar} [day = new ObservableVar(Utils.getEpochDayFromTime((new Date()).getTime()))]
     * Current observable variable containing the day.  Makes a new one if one doesn't exist.
     * @param {FoodDiaryEntryCollection} foodDiaryEntryCollection collection of diary entries.
     * @param {PersonalInfoCollection} personalInfoCollection collection containing personal info entry.
     */
    constructor(day, foodDiaryEntryCollection, personalInfoCollection) {
        /**
         * Current day of our data
         * @type {ObservableVar}
         */
        this.day = day || new ObservableVar(Utils.getEpochDayFromTime((new Date()).getTime()));

        /**
         * Amount of leucine taken this day
         * @type {ObservableVar}
         */
        this.leucineAmount = new ObservableVar(0);

        /**
         * Total calories for the day
         * @type {ObservableVar}
         */
        this.calorieAmount = new ObservableVar(0);

        /**
         * Daily calorie goal
         * @type {ObservableVar}
         */
        this.calorieGoal = new ObservableVar(0);

        /**
         * Daily leucine allowance
         * @type {ObservableVar}
         */
        this.leucineAllowance = new ObservableVar(0);

        /**
         * Entries of FoodDiary for the day.  Observable var containing Data.FoodDiaryEntry array.
         * @type {ObservableVar}
         */
        this.foodDiaryEntries = new ObservableVar([]);

        /**
         * Collection containing all FoodDiaryEntry objects.
         * @type {FoodDiaryEntryCollection}
         */
        this.foodDiaryEntryCollection = foodDiaryEntryCollection;

        /**
         * Collection containing single PersonalInfo object.
         * @type {PersonalInfoCollection}
         */
        this.personalInfoCollection = personalInfoCollection;

        /**
         * Whether or not this class is loading something
         * @type {ObservableVar}
         */
        this.isLoading = new ObservableVar(false);

        this._bindMethods();
        this._addListeners();
    }

    /**
     * Create listeners
     */
    _addListeners() {
        this.day.valueChanged.add(this.loadDaySummary);
    }

    /**
     * Remove listeners
     */
    _removeListeners() {
        this.day.valueChanged.remove(this.loadDaySummary);
    }

    /**
     * Bind global methods to "this" instance.
     * Particularly useful for functions that are added to listeners
     * and may not have the proper scope when called otherwise.
     */
    _bindMethods() {
        var me = this;
        me.loadInfo = _.bind(me.loadInfo, me);
        me.loadGoals = _.bind(me.loadGoals, me);
        me.loadDaySummary = _.bind(me.loadDaySummary, me);
    }

    /**
     * Calculate food summary
     * Utility function for resetting our amount values for a day.
     * Private to ensure that no caller thinks that this will also load the data for the day.
     */
    _calculateFoodSummary() {
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
    }

    /**
     * Load summary for the day.  Load all foods and store them in foodDiaryEntries.
     * Then calculate the food summary.
     * @returns {Promise}
     */
    loadDaySummary() {
        var that = this,
            wasAlreadyLoading = this.isLoading.getValue();

        this.isLoading.setValue(true);

        return this.foodDiaryEntryCollection.selectFoodDiaryEntriesForDay(this.day.getValue(),
                                                                          null)
            .then(function (foodDiaryEntries) {
                      that.foodDiaryEntries.setValue(foodDiaryEntries);
                      that._calculateFoodSummary();
                  })
            .finally(
            function () {
                if (!wasAlreadyLoading) {
                    that.isLoading.setValue(false);
                }
            }
        );
    }

    /**
     * Load our goals from personal info.
     * @returns {Promise}
     */
    loadGoals() {
        var that = this,
            wasAlreadyLoading = this.isLoading.getValue();

        this.isLoading.setValue(true);

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
            )
                .finally(
                function () {
                    if (!wasAlreadyLoading) {
                        that.isLoading.setValue(false);
                    }
                }
            );

        });
    }

    /**
     * Load diary info
     * @returns {Promise}
     */
    loadInfo() {
        var that = this,
            wasAlreadyLoading = this.isLoading.getValue();

        this.isLoading.setValue(true);

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
            )
                .finally(
                function () {
                    if (!wasAlreadyLoading) {
                        that.isLoading.setValue(false);
                    }
                }
            );
        });
    }

    /**
     * Clean up this object
     */
    destroy() {
        var me = this;
        me._removeListeners();
        me.day = null;
        me.leucineAmount = null;
        me.calorieAmount = null;
        me.leucineAllowance = null;
        me.foodDiaryEntries = null;
    }
}