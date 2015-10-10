import $ from "jquery";

const MENU_ACTIVE = 'menuActive';

/**
 * Static class that allows for customization of the toolbar.
 * Not really a widget per say, as it is static and assumes elements (by id) exist in the app HTML.
 **/
export default class Toolbar {
    /**
     * Return the HTML UI element containing our title.
     */
    static _getTitle() {
        return $("#Title")[0];
    }

    /**
     * Get container of the menu item
     * @returns {Element}
     * @private
     */
    static _getMenuIconContainer() {
        // RTL languages should return top right corner, eventually
        return $("#TopLeftContainer")[0];
    }

    /**
     * Set the title
     * @param {string} title New title to be set
     */
    static setTitle(title) {
        Toolbar._getTitle().innerHTML = title;
    }

    /**
     * Set the menu icon's visibility
     * @param {boolean} visible
     */
    static setMenuIconVisibile(visible) {
        if (visible) {
            Toolbar._getMenuIconContainer().visibility = "visible";
        }
        else {
            Toolbar._getMenuIconContainer().visibility = "collapsed";
        }
    }

    /**
     * Remove menu icon handler
     */
    static removeMenuIconHandler() {
        if (Toolbar._menuIconHandler) {
            $(Toolbar._getMenuIconContainer()).off("click", Toolbar._menuIconHandler);
        }
        Toolbar._menuIconHandler = null;
    }

    /**
     * Set menu icon handler
     */
    static setMenuIconHandler(method) {
        Toolbar.removeMenuIconHandler();
        Toolbar._menuIconHandler = method;
        $(Toolbar._getMenuIconContainer()).on("click", Toolbar._menuIconHandler);
    }

    /**
     * Toggle the menu
     */
    static toggleMenu() {
        var win = $("#Window")[0];

        if (win.classList.contains(MENU_ACTIVE)) {
            Toolbar.menuOff();
        }
        else {
            Toolbar.menuOn();
        }
    }

    /**
     * Turn menu on
     * @returns {boolean} whether or not it actually had to change anything to turn on
     */
    static menuOn() {
        var win = $("#Window")[0],
            menu = $("#Menu")[0],
            menuLink = $("#TopLeftContainer")[0];

        if (!win.classList.contains(MENU_ACTIVE)) {
            win.classList.add(MENU_ACTIVE);
            menu.classList.add(MENU_ACTIVE);
            menuLink.classList.add(MENU_ACTIVE);
            return true;
        }
        return false;
    }

    /**
     * Turn menu off
     * @returns {boolean} whether or not it actually had to change anything to turn off
     */
    static menuOff() {
        var win = $("#Window")[0],
            menu = $("#Menu")[0],
            menuLink = $("#TopLeftContainer")[0];

        if (win.classList.contains(MENU_ACTIVE)) {
            win.classList.remove(MENU_ACTIVE);
            menu.classList.remove(MENU_ACTIVE);
            menuLink.classList.remove(MENU_ACTIVE);
            return true;
        }
        return false;
    }
}

Toolbar._menuIconHandler = null;