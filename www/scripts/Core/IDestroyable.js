import ErrorObj from "./Error/ErrorObj";
import ErrorCodes from "./Error/ErrorCodes";

/**
 * Interface for a destroyable object.
 **/
export default class IDestroyable {
    /**
     * Destroy object.  Use to remove all references, event handlers, observers, etc. used by this object.
     */
    destroy() {
        throw new ErrorObj(
            ErrorCodes.UnImplementedException,
            "destroy() unimplemented in object implementing the IDestroyable interface"
        );
    }
}