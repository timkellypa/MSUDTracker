import moment from "moment";
const MILLISECONDS_PER_DAY = 86400000; // (1000 * 60 * 60 * 24)

/**
 * General utility functions to help with date stuff.
 */
export default class DateHelpers {
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
}