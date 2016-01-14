import IPage from "../../../Core/UI/IPage";
import Toolbar from "../Toolbar";
import Menu from "../Menu";
import Form from "../../../Core/UI/Widgets/Form";
import menuTemplate from "!!raw!../../UI/Templates/MainMenu.html";
import formTemplate from "!!raw!../../UI/Templates/FoodDiaryEntryForm.html";

import FoodDiaryEntryViewModel from "../../ViewModel/FoodDiaryEntryViewModel";
import $ from "jquery";
import _ from "underscore";

/**
 * Home page. Summary of daily data.
 * @extends {IPage}
 */
export default class FoodDiaryEntryForm extends IPage {

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
     * @param {Object} options options for showing this page.
     * @returns {Promise}
     */
    show(options) {
        super.show(options);
        let that = this;

        this.context = new FoodDiaryEntryViewModel(options.day);

        this._addListeners();

        return this.context.init().then(
            function () {
                let action = "#/personalinfoform/save";

                Toolbar.setTitle("Enter Info");

                // Setup menu
                // Menu availability is dependent on if we already have info
                // If not, don't allow user to access other parts of the app.
                Toolbar.setMenuIconVisibile(true);
                Toolbar.setMenuIconHandler(Menu.menuOn);
                Menu.buildFromTemplate(menuTemplate);

                Toolbar.setActionIconVisible(true);
                Toolbar.setActionIcon("btn-save", "save");
                Toolbar.setActionIconActive(true);

                $($("#content")[0]).on("click", Menu.menuOff);

                that.infoForm = new Form(that.context, action);
                that.infoForm.show({
                    container: that.$el[0],
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
        // this.context.isLoading.valueChanged.add(this._loadUI);
    }

    /**
     * Clean up event listeners
     * @private
     */
    _removeListeners() {
        // this.context.isLoading.valueChanged.remove(this._loadUI);
    }

    /**
     * Destroy the UI, event listeners, menu, and references to objects for this page
     */
    destroy() {
        Toolbar.removeMenuIconHandler();
        Toolbar.removeActionIconHandler();
        $($("#content")[0]).off("click", Menu.menuOff);
        Toolbar.clearActionIcon();

        Menu.clearMenu();
        this._removeListeners();

        this.infoForm.destroy();

        this.context.destroy();
        this.context = null;
        super.destroy();
    }

    /**
     * Load up the UI for this page
     * @private
     */
    _loadUI() {
        var win = $("#window")[0];

        if (this.context.isLoading.getValue()) {
            win.classList.add("passive-load");
        }
        else {
            win.classList.remove("passive-load");
        }
    }
}