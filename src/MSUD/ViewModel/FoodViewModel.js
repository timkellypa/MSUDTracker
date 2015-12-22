import IViewModel from "../../Core/ViewModel/IViewModel";
import FoodCollection from "../../MSUD/Data/FoodCollection";
import Config from "../../MSUD/Config";
import Database from "../../Core/Data/Database";
import CollectionResultset from "../../Core/Data/CollectionResultset";
import ObservableVar from "../../Core/ObservableVar";
import SingleSelectBehavior from "../../Core/UI/Widgets/CollectionListBehaviors/SingleSelectBehavior";
import _ from "underscore";

/**
 * Class containing all the information we need in regards to foods,
 * @extends {IViewModel}
 **/
export default class DiaryViewModel extends IViewModel {
    constructor() {

        super();

        this.bindMethods();

        /**
         * Collection of foods
         * @type {FoodCollection}
         */
        this.foodCollection = null;

        /**
         * Observable list of foods to select.
         * @type {ObservableCollection}
         */
        this.foodObservableCollection = new CollectionResultset({sortFunction: this.sortFood, limit: 25});

        this.foodFilter = new ObservableVar("");

        this.isLoadingFood = new ObservableVar(false);

        this.foodFilterBehaviors = [SingleSelectBehavior];
    }

    init() {
        this.addEventListeners();
        let db = new Database(Config.Globals.databaseName);
        this.foodCollection = new FoodCollection(db);
        return db.init().then(() => this.loadFood());
    }

    sortFood(food1, food2) {
        let comp1 = food1.description.toLowerCase(),
            comp2 = food2.description.toLowerCase();

        if (comp1 > comp2) {
            return 1;
        }
        else if (comp2 > comp1) {
            return -1;
        }
        else {
            return 0;
        }
    }

    /**
     * Return whether or not the food meets our criteria.
     * @param {Food} food food to check
     * @returns {boolean}
     */
    filterFood(food) {
        return (food.description.toLowerCase().indexOf(this.foodFilter.getValue().toLowerCase()) !== -1);
    }

    loadFood() {
        this.isLoadingFood.setValue(true);
        this.foodObservableCollection.clear();
        if (this.foodFilter.getValue().length === 0) {
            this.isLoadingFood.setValue(false);
            return Promise.resolve();
        }

        this.foodCollection.select({resultSet: this.foodObservableCollection, filterFunction: this.filterFood});
        return this.foodObservableCollection.loadPromise.then((isDone) => {
            if (isDone) {
                this.isLoadingFood.setValue(false);
            }
        });
    }

    bindMethods() {
        this.loadFood = _.bind(this.loadFood, this);
        this.filterFood = _.bind(this.filterFood, this);
        this.sortFood = _.bind(this.sortFood, this);
    }

    addEventListeners() {
        this.foodFilter.valueChanged.add(this.loadFood);
    }

    removeEventListeners() {
        this.foodFilter.valueChanged.add(this.loadFood);
    }

    destroy() {
        this.removeEventListeners();
        this.foodFilter = null;
        this.foodObservableCollection = null;
        this.foodCollection = null;
    }
}