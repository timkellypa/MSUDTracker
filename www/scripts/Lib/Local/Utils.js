import moment from "moment";
const MILLISECONDS_PER_DAY = 86400000; // (1000 * 60 * 60 * 24)

/**
 * General utility functions for the application.
 */
export default class Utils {
    /**
     * Get Number of days since Epoch
     * @param {number} time (result of Date.prototype.getTime())
     * @return {number} full days contained in the Javascript time.
     */
    static getEpochDayFromTime(time) {
        var curDT = new Date(time);
        return (parseInt((time - (curDT.getTimezoneOffset() * 60 * 1000)) / MILLISECONDS_PER_DAY, 10));
    }

    /**
     * Get Number of days since Epoch
     * @param {number} day days contained in the Javascript time.
     * @return {number} time (result of Date.prototype.getTime())
     */
    static getTimeFromEpochDay(day) {
        var time = day * MILLISECONDS_PER_DAY;
        return time + (new Date(time)).getTimezoneOffset() * 60 * 1000;
    }

    /**
     * Full Date Format.  Done in a central location, so it could be changed by altering the locale.
     * @param {Date} date date object to format.
     * @return {string} date formatted.
     */
    static fullDateFormat(date) {
        return moment(date).format("dddd, MMM DD, YYYY");
    }

    /**
     * Get the promise library
     * @returns {Object} promise library
     */
    static getPromiseLib() {
        return require("rsvp");
    }

    /**
     * Get a normal promise object.
     * @param {Function} method promise method.  Takes a success and failure function param.
     * @param {string} [label] optional promise label.
     * @returns {Promise} new promise object
     */
    static createPromise(method, label) {
        var lib = this.getPromiseLib();
        return new lib.Promise(method, label);
    }

    /**
     * Get the HTML "head" section from an HTML file.
     * @param {string} htmlString
     * @returns {string} contents of the "head" section of the HTML file, or an empty string if there is none.
     * @assumes a relatively valid HTML file with a single, contained "head" section, or none at all
     */
    static getHTMLHeader(htmlString) {
        var matches = /<head>([\d\s\W\S]*)<\/head>/.exec(htmlString);

        if (matches && matches.length === 2) {
            return matches[1];
        }
        return "";
    }

    /**
     * Get the HTML "body" section from an HTML file.
     * @param {string} htmlString
     * @returns {string} contents of the "body" section of the HTML file, or an empty string if there is none.
     * @assumes a relatively valid HTML file with a single, contained "body" section, or none at all
     */
    static getHTMLBody(htmlString) {
        var matches = /<body>([\d\s\W\S]*)<\/body>/.exec(htmlString);

        if (matches && matches.length === 2) {
            return matches[1];
        }
        return "";
    }
}