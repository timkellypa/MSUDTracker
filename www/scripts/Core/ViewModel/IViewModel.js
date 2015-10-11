import ErrorObj from '../Error/ErrorObj';
import ErrorCodes from '../Error/ErrorCodes';
import IDestroyable from "../IDestroyable.js";

/**
 * Interface for a page
 **/
export default class IViewModel extends IDestroyable {
    /**
     * Construct an IPage object
     */
    constructor() {
        super();
    }

    /**
     * Initialize the page.  This will create all the UI
     */
    init() {
        throw new ErrorObj(ErrorCodes.UnImplementedException, "IPage.init() unimplemented");
    }
}