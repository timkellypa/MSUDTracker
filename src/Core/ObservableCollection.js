import Observer from "./Observer";
import CollectionChangedEventArgs from "./CollectionChangedEventArgs";
import _ from "underscore";

/**
 * Container of an array whose values can be observed
 */
export default class ObservableCollection {
    /**
     * Observable collection
     * @param {object} [options={}]
     * @param [options.initialValue] initial value for this collection
     * @param [options.sortFunction] sort function for this collection
     */
    constructor(options = {}) {
        /**
         * Items for this collection
         * @type {Array}
         */
        this.items = [];

        if (_.isArray(options.initialValue)) {
            this.items = options.initialValue;
        }

        /**
         * Sorting method for items in this collection.
         * @type {Function}
         */
        this.sortFunction = options.sortFunction || (() => 1);

        /**
         * Change event for a collection
         * @type {Observer}
         */
        this.collectionChanged = new Observer();
    }

    /**
     * Insert an item
     * @param item
     * @param index
     */
    insert(item, index = -1) {
        if (index === -1) {
            index = this.items.push(item);
        }
        else {
            this.items.splice(index, 0, item);
        }
        this.collectionChanged.fire(new CollectionChangedEventArgs("insert", item, index));
    }

    /**
     * Get sort index to put in an item.
     * TODO:  Use binary search instead of bubble.
     * @param {Object} item item for which to get the sort index.
     * @returns {number} index in which to place the new item to maintain sort order.
     */
    getSortNdx(item) {
        for (let iNdx = this.count() - 1; iNdx >= 0; --iNdx) {
            let sortVal = this.sortFunction(item, this.items[iNdx]);
            if (sortVal >= 0) {
                return iNdx + 1;
            }
        }
        return 0;
    }

    /**
     * Insert an item sorted into the array.
     * @param {Object} item item to insert
     */
    insertSorted(item) {
        let index = this.getSortNdx(item);
        this.insert(item, index);
    }

    /**
     * Remove an item.
     * @param item
     * @returns {number} index of the array from which the item was removed
     */
    remove(item) {
        let index = this.items.indexOf(item);
        if (index === -1) {
            return -1;
        }
        this.items.splice(index, 1);
        this.collectionChanged.fire(new CollectionChangedEventArgs("remove", item, index));
        return index;
    }

    /**
     * Clear the collection
     * @returns {number} number of items that were removed
     */
    clear() {
        let deletedItemsArray = this.items.splice(0, this.items.length);
        this.collectionChanged.fire(new CollectionChangedEventArgs("clear"));
        return deletedItemsArray.length;
    }

    count() {
        return this.items.length;
    }

    getAt(index) {
        return this.items[index] || null;
    }

    indexOf(item) {
        return this.items.indexOf(item);
    }

    move(item, toIndex) {
        let itemIndex = this.remove(item);
        if (itemIndex === -1) {
            return false;
        }
        this.add(item, toIndex);
        return true;
    }
}