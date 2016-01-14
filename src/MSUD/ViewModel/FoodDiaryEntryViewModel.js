import IViewModel from "../../Core/ViewModel/IViewModel";
import DateHelpers from "../../Core/Lib/DateHelpers";
import ObservableVar from "../../Core/ObservableVar";
import Promise from "../../Core/Lib/Promise";

export default class FoodDiaryEntryViewModel extends IViewModel {
    constructor(day, entryID = null) {
        let today,
            curDay;

        super();
        this.bindMethods();
        today = DateHelpers.getEpochDayFromTime((new Date()).getTime());
        curDay = typeof day === "number" ? day : today;

        /**
         * Current day (value of day picker, typically)
         * @type {ObservableVar}
         */
        this.currentDay = new ObservableVar(curDay);

        /**
         * Entry ID.  Null for a new one.
         * @type {ObservableVar}
         */
        this.id = new ObservableVar(entryID);

        /**
         * Servings taken for this value.
         * @type {ObservableVar}
         */
        this.servings = new ObservableVar("4");
    }

    init() {
        return Promise.resolve();
    }

    bindMethods() {
    }

    addEventListeners() {

    }

    removeEventListeners() {

    }

    destroy() {
        this.currentDay = null;
        this.servings = null;
    }
}