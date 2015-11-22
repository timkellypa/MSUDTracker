import DiaryViewModel from "./DiaryViewModel";
import PersonalInfoViewModel from "./PersonalInfoViewModel";
import ObservableVar from "../../Core/ObservableVar";
import Promise from "../../Core/Lib/Promise";
import IViewModel from "../../Core/ViewModel/IViewModel";
import _ from "underscore";

/**
 * Class that contains the information for a diary, as well as the user's personal info, and some computed values.
 */
export default class DiarySummaryViewModel extends IViewModel {

    constructor(day) {
        super();

        this.bindMethods();

        /**
         * Instance of DiaryViewModel for this object.
         * @type {DiaryViewModel}
         */
        this.diaryViewModel = new DiaryViewModel(day);

        /**
         * Instance of PersonalInfoViewModel for this object
         * @type {PersonalInfoViewModel}
         */
        this.personalInfoViewModel = new PersonalInfoViewModel();

        /**
         * Amount of leucine that has been used today.
         * @type {ObservableVar}
         */
        this.leucineAmount = new ObservableVar(0);

        /**
         * Amount of calories consumed today.
         * @type {ObservableVar}
         */
        this.calorieAmount = new ObservableVar(0);

        this.isLoading = new ObservableVar(true);

        this.isCalculatingSummary = new ObservableVar(false);
    }

    init() {
        let initPromises = [];
        this.addListeners();
        initPromises.push(this.diaryViewModel.init());
        initPromises.push(this.personalInfoViewModel.init());
        return Promise.all(initPromises)
            .finally(this.checkLoad);
    }

    checkLoad() {
        this.isLoading.setValue(
            this.isCalculatingSummary.getValue()
            || this.diaryViewModel.isLoading.getValue()
            || this.personalInfoViewModel.isLoading.getValue()
        );
    }

    addListeners() {
        this.diaryViewModel.isLoading.valueChanged.add(this.checkLoad);
        this.diaryViewModel.isLoading.valueChanged.add(this.checkLoad);
        this.isCalculatingSummary.valueChanged.add(this.checkLoad);
        this.diaryViewModel.foodDiaryEntries.valueChanged.add(this.calculateFoodSummary);
    }

    removeListeners() {
        this.diaryViewModel.isLoading.valueChanged.remove(this.checkLoad);
        this.diaryViewModel.isLoading.valueChanged.remove(this.checkLoad);
        this.isCalculatingSummary.valueChanged.remove(this.checkLoad);
        this.diaryViewModel.foodDiaryEntries.valueChanged.remove(this.calculateFoodSummary);
    }

    /**
     * Calculate food summary
     * Utility function for resetting our amount values for a day.
     * Private to ensure that no caller thinks that this will also load the data for the day.
     */
    calculateFoodSummary() {
        var entries,
            totalLeucine = 0,
            totalCalories = 0,
            iNdx,
            curEntry;
        this.isCalculatingSummary.setValue(true);

        if (this.diaryViewModel.foodDiaryEntries === null) {
            return;
        }

        entries = this.diaryViewModel.foodDiaryEntries.getValue();
        for (iNdx = 0; iNdx < entries.length; ++iNdx) {
            curEntry = entries[iNdx];
            totalLeucine += curEntry.Food.leucineMg * curEntry.servings;
            totalCalories += curEntry.Food.energyKCal * curEntry.servings;
        }

        this.leucineAmount.setValue(totalLeucine);
        this.calorieAmount.setValue(totalCalories);
        this.isCalculatingSummary.setValue(false);
    }

    bindMethods() {
        this.checkLoad = _.bind(this.checkLoad, this);
        this.calculateFoodSummary = _.bind(this.calculateFoodSummary, this);
        this.init = _.bind(this.init, this);
        this.destroy = _.bind(this.destroy, this);
    }

    destroy() {
        this.removeListeners();

        this.diaryViewModel.destroy();
        this.personalInfoViewModel.destroy();

        this.diaryViewModel = null;
        this.personalInfoViewModel = null;
        this.leucineAmount = null;
        this.calorieAmount = null;
        this.isCalculatingSummary = null;
        this.isLoading = null;
    }

}