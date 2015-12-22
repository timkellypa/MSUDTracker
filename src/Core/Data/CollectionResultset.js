import ObservableCollection from "../ObservableCollection";
import Promise from "../Lib/Promise";

/**
 * Extend an observable collection to have a promise that resolves when it is finished loading.
 */
export default class CollectionResultset extends ObservableCollection {
    /**
     * Construct a CollectionResultSet
     * @param {Object} options options for this collection
     * @param {Array} [options.initialValue] initial value of the collection.
     * @param {Function} [options.sortFunction] sort function for this collection
     * @param {number} [options.limit] limit of maximum number of items for this collection.
     */
    constructor(options) {
        super(options);

        /**
         * Promise of loading
         * @type {Promise.<boolean>} promise that resolves with true if select was allowed to finish, and false if
         * cancelled.
         */
        this.loadPromise = Promise.resolve();

        this.limit = options.limit;

        /**
         * A token (timestamp) for loading.  Used to prevent duplicate loads.
         * @type {number}
         */
        this.loadToken = null;
    }

    insert(item, index = -1) {
        if (typeof this.limit !== "number") {
            return super.insert(item, index);
        }

        if (
            (index === -1 && this.count() >= this.limit)
            || index >= this.limit
        ) {
            return;
        }

        super.insert(item, index);

        // After this insert, remove any excessive items at the end of our list.
        for (let i = this.count() - 1; i >= this.limit; --i) {
            this.remove(this.getAt(i));
        }
    }
}