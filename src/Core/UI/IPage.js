import IView from "./IView.js";

/**
 * Interface for a page
 * @extends {IView}
 **/
export default class IPage extends IView {
    /**
     * Construct an IPage object
     */
    constructor() {
        super();

        /**
         * Context for this page.
         * @type {IViewModel}
         */
        this.context = null;
    }
}