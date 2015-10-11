import ErrorObj from '../Error/ErrorObj';
import ErrorCodes from '../Error/ErrorCodes';
import IDestroyable from "../IDestroyable.js";

/**
 * Interface for a view
 **/
export default class IView extends IDestroyable {
    constructor() {
        super();
    }

    /**
     * Initialize the view.  This will create all the UI
     */
    show() {
        throw new ErrorObj(ErrorCodes.UnImplementedException, "IPage.init() unimplemented");
    }
}