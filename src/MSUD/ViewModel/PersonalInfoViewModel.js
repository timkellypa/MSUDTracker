import ObservableVar from "../../Core/ObservableVar";
import Database from "../../Core/Data/Database";
import Config from "../Config";
import IViewModel from "../../Core/ViewModel/IViewModel";
import PersonalInfoCollection from "../Data/PersonalInfoCollection";
import PersonalInfo from "../Data/PersonalInfo";

/**
 * Class containing the information we need to store a diary,
 *      specifically the current day, and the foods consumed that day.
 * @extends {IViewModel}
 **/
export default class PersonalInfoViewModel extends IViewModel {
    /**
     * Constructs DiaryViewModel
     **/
    constructor() {
        super();

        /**
         * PersonalInfo Collection
         * @type {PersonalInfoCollection}
         */
        this.personalInfoCollection = null;

        /**
         * Leucine allowed
         * @type {ObservableVar}
         */
        this.leucineAllowance = new ObservableVar(null);

        /**
         * Calorie goal
         * @type {ObservableVar}
         */
        this.calorieGoal = new ObservableVar(null);

        /**
         * Whether or not this view model is loading
         * @type {ObservableVar}
         */
        this.isLoading = new ObservableVar(false);
    }

    getLeucineValidationError() {
        if (this.leucineAllowance.getValue() === "") {
            return "Please enter a leucine allowance";
        }
        return null;
    }

    getCalorieValidationError() {
        if (this.calorieGoal.getValue() === "") {
            return "Please enter a calorie goal";
        }
        return null;
    }

    save() {
        let personalInfo = new PersonalInfo(
                {
                    leucineAllowance: this.leucineAllowance.getValue(),
                    calorieGoal: this.calorieGoal.getValue(),
                    id: 1
                }
            );
        return this.personalInfoCollection.put(personalInfo);
    }

    /**
     * Initialize view model
     */
    init() {
        var db,
            that = this;

        this.isLoading.setValue(true);

        db = new Database(Config.Globals.databaseName);
        this.personalInfoCollection = new PersonalInfoCollection(db);

        return db.init(
        ).then(
            function () {
                return that.personalInfoCollection.getItemById(1);
            }
        ).then(
            function (personalInfo) {
                if (personalInfo !== null) {
                    that.leucineAllowance.setValue(personalInfo.leucineAllowance);
                    that.calorieGoal.setValue(personalInfo.calorieGoal);
                }
            }
        ).finally(
            function () {
                that.isLoading.setValue(false);
            }
        );
    }

    /**
     * Destroy this object.  Remove all references and listeners
     */
    destroy() {
        this.personalInfoCollection = null;
        this.leucineAllowance = null;
        this.calorieGoal = null;
    }
}