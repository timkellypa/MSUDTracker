import ErrorCodes from "./ErrorCodes.js";

/**
 * Standard error object for this application.
 * Contains some extra stuff, like an error code.
 */

export default class ErrorObj {
    /**
     * Constructs the ErrorObj
     * @param {ErrorCodes} code error code
     * @param {string} message error message
     * @param {Error} [innerException = null] actual exception thrown.
     */
    constructor(code, message, innerException) {
        /**
         * Code defining the type of error.
         * @type {ErrorCodes}
         */
        this.code = code;

        /**
         * Message for the error
         * @type {string}
         */
        this.message = message;

        /**
         * An inner exception object (native JS error object)
         * @type {Error}
         */
        this.innerException = innerException !== undefined ? innerException : null;
    }

    toString() {
        let innerString = "";
        if (this.innerException instanceof Error || this.innerException instanceof DOMError) {
            innerString = `${this.innerException.name}: ${this.innerException.message}`;
        }
        else if (this.innerException !== null) {
            innerString = this.innerException.toString();
        }
        return `${this.code}: ${this.message}
         Inner Exception: ${innerString}`;
    }
}

ErrorObj.Codes = ErrorCodes;