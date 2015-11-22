import ObservableVar from "../../Core/ObservableVar";
import Database from "../../Core/Data/Database";
import Config from "../Config";
import DateHelpers from "../../Core/Lib/DateHelpers";
import FoodCollection from "../Data/FoodCollection";
import FoodDiaryEntryCollection from "../Data/FoodDiaryEntryCollection";
import IViewModel from "../../Core/ViewModel/IViewModel";
import PersonalInfoCollection from "../Data/PersonalInfoCollection";
import _ from "underscore";

/**
 * Class containing the information we need to store a diary,
 *      specifically the current day, and the foods consumed that day.
 * @extends {IViewModel}
 **/
export default class DiaryViewModel extends IViewModel {
    /**
     * Constructs DiaryViewModel
     * @param {number} [day] day with which to initialize view model.  Will default to epoch day for today.
     **/
    constructor(day) {
        var curDay,
            today;

        super();

        this.bindMethods();

        /**
         * Whether or not the view model is currently in a state of loading.
         * @type {ObservableVar}
         */
        this.isLoading = new ObservableVar(true);

        today = DateHelpers.getEpochDayFromTime((new Date()).getTime());
        curDay = typeof day === "number" ? day : today;

        /**
         * Current day (value of day picker, typically)
         * @type {ObservableVar}
         */
        this.currentDay = new ObservableVar(curDay);

        /**
         * Day Toolbar minimum value
         * @type {ObservableVar}
         */
        this.dayPickerMinValue = new ObservableVar(0);

        /**
         * Day Toolbar maximum value
         * @type {ObservableVar}
         */
        this.dayPickerMaxValue = new ObservableVar(today);

        /**
         * Food collection
         * @type {FoodCollection}
         */
        this.foodCollection = null;

        /**
         * FoodDiaryEntry collection
         * @type {FoodDiaryEntryCollection}
         */
        this.foodDiaryEntryCollection = null;

        /**
         * PersonalInfo Collection
         * @type {PersonalInfoCollection}
         */
        this.personalInfoCollection = null;

        /**
         * Entries of Food for the day.  Observable var containing Data.FoodDiaryEntry array.
         * @type {ObservableVar}
         */
        this.foodDiaryEntries = new ObservableVar([]);
    }

    /**
     * Initialize view model
     */
    init() {
        var db,
            that = this;

        db = new Database(Config.Globals.databaseName);
        this.foodCollection = new FoodCollection(db);
        this.foodDiaryEntryCollection = new FoodDiaryEntryCollection(db);
        this.personalInfoCollection = new PersonalInfoCollection(db);

        return db.init()
            .then(this.loadDiary)
            .finally(
            function () {
                that.addListeners();
                that.isLoading.setValue(false);
            }
        );
    }

    /**
     * Load diary entries for the day.  Load all foods and store them in foodDiaryEntries.
     * Then calculate the food summary.
     * @returns {Promise}isCalculating
     */
    loadDiary() {
        var that = this,
            wasAlreadyLoading = this.isLoading.getValue();

        this.isLoading.setValue(true);

        return this.foodDiaryEntryCollection.selectFoodDiaryEntriesForDay(this.currentDay.getValue(),
            null)
            .then(function (foodDiaryEntries) {
                that.foodDiaryEntries.setValue(foodDiaryEntries);
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
     * Create listeners
     */
    addListeners() {
        this.currentDay.valueChanged.add(this.loadDiary);
    }

    /**
     * Remove listeners
     */
    removeListeners() {
        this.currentDay.valueChanged.remove(this.loadDiary);
    }

    /**
     * Destroy this object.  Remove all references and listeners
     */
    destroy() {
        this.removeListeners();
        this.foodCollection = null;
        this.foodDiaryEntryCollection = null;
        this.personalInfoCollection = null;

        this.isLoading = null;

        this.currentDay = null;
        this.dayPickerMinValue = null;
        this.dayPickerMaxValue = null;
    }

    /**
     * Bind methods to this.
     * @private
     */
    bindMethods() {
        this.loadDiary = _.bind(this.loadDiary, this);
        this.init = _.bind(this.init, this);
    }
}