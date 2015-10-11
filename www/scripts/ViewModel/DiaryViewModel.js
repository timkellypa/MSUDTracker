import ObservableVar from "Core/ObservableVar";
import Database from "Core/Data/Database";
import Config from "Config";
import Utils from "Lib/Local/Utils";
import FoodDiaryDaySummary from "ViewModel/Classes/FoodDiaryDaySummary";
import FoodCollection from "Data/FoodCollection";
import FoodDiaryEntryCollection from "Data/FoodDiaryEntryCollection";
import IViewModel from "../Core/ViewModel/IViewModel";
import PersonalInfoCollection from "Data/PersonalInfoCollection";
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

        /**
         * Whether or not the view model is currently in a state of loading.
         * @type {ObservableVar}
         */
        this.isLoading = new ObservableVar(true);

        today = Utils.getEpochDayFromTime((new Date()).getTime());
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
         * Summary of food diary information
         * @type {ObservableVar}
         */
        this.foodDiaryDaySummary = null;

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
    }

    /**
     * Add event listeners
     * @private
     */
    _addListeners() {
        this.foodDiaryDaySummary.isLoading.valueChanged.add(this.checkLoad);
    }

    /**
     * Remove event listeners
     * @private
     */
    _removeListeners() {
        this.foodDiaryDaySummary.isLoading.valueChanged.remove(this.checkLoad);
    }

    /**
     * Destroy this object.  Remove all references and listeners
     */
    destroy() {
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
    }

    /**
     * Bind methods to this.
     * @private
     */
    _bindMethods() {
        var that = this;
        that.checkLoad = _.bind(that.checkLoad, that);
    }

    /**
     * Check to see if this ViewModel is currently loading.
     * If there are other classes, make this an AND of all their loading values
     */
    checkLoad() {
        this.isLoading.setValue(this.foodDiaryDaySummary.isLoading.getValue());
    }
}