import IPage from "../../../Core/UI/IPage";
import Toolbar from "../../UI/Widgets/Toolbar";
import Menu from "../../UI/Widgets/Menu";
import Form from "../../../Core/UI/Widgets/Form";
import menuTemplate from "!!raw!../../UI/Templates/MainMenu.html";
import formTemplate from "!!raw!../../UI/Templates/PersonalInfoForm.html";

import PersonalInfoViewModel from "../../ViewModel/PersonalInfoViewModel";
import $ from "jquery";
import _ from "underscore";

/**
 * Home page. Summary of daily data.
 * @extends {IPage}
 */
export default class DaySummary extends IPage {

    /**
     * Construct DaySummary
     */
    constructor() {
        super();

        /**
         * Form widget
         * @type {DayPicker}
         */
        this.infoForm = null;

        this._bindMethods();
    }

    /**
     * Build the UI for the page
     * @returns {Promise}
     */
    show() {
        let screen = $("#Screen")[0],
            that = this;

        this.context = new PersonalInfoViewModel();

        this._addListeners();

        return this.context.init().then(
            function () {
                let action = "#/personalinfoform/save";

                Toolbar.setTitle("Enter Personal Info");

                // Setup menu
                // Menu availability is dependent on if we already have info
                // If not, don't allow user to access other parts of the app.
                if (that.context.leucineAllowance.getValue() === null || that.context.calorieGoal.getValue() === null) {
                    Menu.menuOff();
                    Toolbar.setMenuIconVisibile(false);
                }
                else {
                    Toolbar.setMenuIconVisibile(true);
                    Toolbar.setMenuIconHandler(Menu.MenuOn);
                    Menu.buildFromTemplate(menuTemplate);
                }
                Toolbar.setActionIconVisible(true);
                Toolbar.setActionIcon("saveBtn", "save");
                Toolbar.setActionIconActive(true);

                $($("#Content")[0]).on("click", Menu.menuOff);

                that.infoForm = new Form(that.context, action);
                that.infoForm.show({
                    container: screen,
                    template: formTemplate
                });
                Toolbar.setActionIconHandler(that.infoForm.submitForm);
            }
        );
    }

    /**
     * Bind methods to "this" in case they are called without context.
     * @private
     */
    _bindMethods() {
        var that = this;
        that._loadUI = _.bind(that._loadUI, that);
    }

    /**
     * Add event listeners
     * @private
     */
    _addListeners() {
        this.context.isLoading.valueChanged.add(this._loadUI);
    }

    /**
     * Clean up event listeners
     * @private
     */
    _removeListeners() {
        this.context.isLoading.valueChanged.remove(this._loadUI);
    }

    /**
     * Destroy the UI, event listeners, menu, and references to objects for this page
     */
    destroy() {
        Toolbar.removeMenuIconHandler();
        Toolbar.removeActionIconHandler();
        $($("#Content")[0]).off("click", Menu.menuOff);
        Toolbar.clearActionIcon();

        Menu.clearMenu();
        this._removeListeners();

        this.infoForm.destroy();

        this.context.destroy();
        this.context = null;
    }

    /**
     * Load up the UI for this page
     * @private
     */
    _loadUI() {
        var win = $("#Window")[0];

        if (this.context.isLoading.getValue()) {
            win.classList.add("passiveLoad");
        }
        else {
            win.classList.remove("passiveLoad");
        }
    }
}