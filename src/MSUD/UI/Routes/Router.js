/*global window */
import * as PathJS from "pathjs";
import Menu from "../Widgets/Menu";
import DateHelpers from "../../../Core/Lib/DateHelpers";
import $ from "jquery";
import DaySummary from "../Pages/DaySummary";
import PersonalInfoForm from "../Pages/PersonalInfoForm.js";
import PersonalInfoViewModel from "../../ViewModel/PersonalInfoViewModel";
import Promise from "../../../Core/Lib/Promise";

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

        this.personalInfoViewModel = new PersonalInfoViewModel();
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
     * Check to see if the user has personal info.
     * Redirect if none yet.
     * @returns {Promise<void>} accepted or rejected based on the presence of personal info.
     */
    checkForInfo() {
        let that = this;
        return this.personalInfoViewModel.init()
            .then(() => {
                return new Promise((resolve, reject) => {
                    if (
                        that.personalInfoViewModel.leucineAllowance.getValue() === null
                        || that.personalInfoViewModel.calorieGoal.getValue() === null
                    ) {
                        window.location = "#/personalinfoform";
                        reject();
                    }
                    else {
                        resolve();
                    }
                });
            })
    }

    /**
     * Initialize the router, and set up all path listeners
     */
    init() {
        let that = this,
            bPathIsValid = false,
            firstLoad = true;

        Path.map("#/daysummary/day/:day").to(function () {
            bPathIsValid = true;
            that.checkForInfo().then(() => {
                var day = parseInt(this.params.day, 10),
                    loadClass = firstLoad ? "initialLoad" : "pageLoad";


                $("#Window")[0].classList.add(loadClass);

                if (isNaN(day)) {
                    day = null;
                }
                Menu.menuOff();
                that.clearCurrentPage();

                that.currentPage = new DaySummary();
                that.currentPage.show(
                    day
                ).finally(
                    function () {
                        $("#Window")[0].classList.remove(loadClass);
                        firstLoad = false;
                    }
                );
            });
        });


        Path.map("#/personalinfoform/save").to(function () {
            bPathIsValid = true;
            if (!(/^#\/personalinfoform/.test(Path.routes.previous))) {
                // not coming from the form... skip and go back an extra one.
                history.back();
                return;
            }

            if (that.currentPage && that.currentPage.context) {
                that.currentPage.context.isLoading.setValue(true);
                that.currentPage.context.save()
                    .then(() => {
                        window.location = "#/daysummary/day/" + DateHelpers.getEpochDayFromTime((new Date()).getTime());
                    });
            } else {
                // No view model.  Must have been a reload.  Go to personalinfoform.
                window.location = "#/personalinfoform";
            }
        });

        Path.map("#/personalinfoform").to(function () {
            bPathIsValid = true;
            var loadClass = firstLoad ? "initialLoad" : "pageLoad";

            $("#Window")[0].classList.add(loadClass);

            Menu.menuOff();
            that.clearCurrentPage();

            that.currentPage = new PersonalInfoForm();
            that.currentPage.show().finally(
                function () {
                    $("#Window")[0].classList.remove(loadClass);
                    firstLoad = false;
                }
            )
        });

        Path.listen();

        // By default, go to today.
        if (!bPathIsValid) {
            window.location = "#/daysummary/day/" + DateHelpers.getEpochDayFromTime((new Date()).getTime());
        }
    }
}