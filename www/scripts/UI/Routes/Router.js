/*global window */
import * as PathJS from "pathjs";
import Menu from "../Widgets/Menu";
import Utils from "../../Lib/Local/Utils";
import $ from "jquery";
import DaySummary from "../Pages/DaySummary";

let Path = PathJS.pathjs;

/**
 * Router. Creates a router of URL requests.
 */
export default class Router {
    /**
     * Constructs the router
     */
    constructor() {
        /**
         * Page object that we are currently displaying
         * @type {IPage}
         */
        this.currentPage = null;
    }

    /**
     * Destory all objects/UI in current page
     */
    clearCurrentPage() {
        if (this.currentPage) {
            this.currentPage.destroy();
        }
    }

    /**
     * Initialize the router, and set up all path listeners
     */
    init() {
        var that = this,
            bPathIsValid = false,
            firstLoad = true;

        Path.map("#/daysummary/day/:day").to(function () {
            var day = parseInt(this.params.day, 10),
                loadClass = firstLoad ? "initialLoad" : "pageLoad";

            $("#Window")[0].classList.add(loadClass);

            bPathIsValid = true;
            if (isNaN(day)) {
                day = null;
            }
            Menu.menuOff();
            that.clearCurrentPage();
            that.currentPage = new DaySummary();
            that.currentPage.show(day, firstLoad
            ).catch((e) => {
                        throw e;
                    }
            ).finally(
                function () {
                    $("#Window")[0].classList.remove(loadClass);
                    firstLoad = false;
                }
            )
        });

        Path.listen();

        // By default, go to today.
        if (!bPathIsValid) {
            window.location = "#/daysummary/day/" + Utils.getEpochDayFromTime((new Date()).getTime());
        }
    }
}