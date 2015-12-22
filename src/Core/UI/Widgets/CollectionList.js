import IFormInputWidget from "../IFormInputWidget";
import ObservableCollection from "../../ObservableCollection";
import _ from "underscore";
import $ from "jquery";

/**
 * List of ObservableCollection items.
 * Each item is added to an ItemContainer, using an ItemTemplate.
 * ItemTemplate nodes should have data-property elements, referencing object properties for each item.
 */
export default class CollectionList extends IFormInputWidget {

    /**
     * @param {Object} options options for this widget
     * @param {ObservableCollection} options.collection collection of items.
     */
    constructor(options) {
        super(options);
        this.bindMethods();

        this.collection = options.collection || new ObservableCollection();

        /**
         * Item template for list items.  Will be cached in this property.
         * @type {String}
         */
        this.itemTemplate = null;

        /**
         * Item container.  Will be cached in this property.
         * @type {jQuery}
         */
        this.$itemContainer = null;

        this.behaviors = [];

        if (options.behaviors) {
            for (let i = 0, len = options.behaviors.length; i < len; ++i) {
                this.behaviors.push(new options.behaviors[i](this));
            }
        }
    }

    /**
     * Show our widget, and initialize event listeners.
     * Whether using an element or a template, div's with classes "item-container" and "item-template" will
     * become the container for the list and template, respectively.
     * @param options
     * @param {Element} options.element element to use.
     * @returns {Promise.<void>} promise resolved when show is finished.
     */
    show(options) {
        let that = this;
        return super.show(options).then(
            () => {
                that.initItemContainer();
                that.initItemTemplate();
                that.displayItemsArray();
                that.addEventListeners();

                for (let i = 0, len = that.behaviors.length; i < len; ++i) {
                    that.behaviors[i].init();
                }
            }
        );
    }

    /**
     * Create this.$itemContainer, default to an empty div.
     */
    initItemContainer() {
        this.$itemContainer = this.$el.find(".item-container");
        if (this.$itemContainer.length === 0) {
            this.$itemContainer = $("<div class=\"item-container\"></div>");
            this.$el.add(this.$itemContainer);
        }
    }

    /**
     * Find text for an item template, and remove the HTML element.  Default to an empty div.
     */
    initItemTemplate() {
        let $template;
        if (this.itemTemplate === null) {
            $template = this.$el.find(".item-template");
            this.itemTemplate = $template.length > 0 ? $template[0].outerHTML : "<div class='item-template'></div>";

            // Remove item template HTML item after getting string template
            $template.remove();
        }
    }

    /**
     * Display an item at an index
     * @param {Object} item object to be displayed
     * @param {number} item.id ID for the item.  Must be part of the object for selectors.
     * @param {number} [index=-1] index at which to add the item. -1 (default) to append to the end.
     */
    displayItem(item, index = -1) {
        let $newItem = $(this.itemTemplate).first(),
            indexSelector,
            method;

        switch(index) {
            case -1:
            case this.$itemContainer.find(".item-template").length:
                indexSelector = 'last';
                method = "after";
                break;
            case 0:
                indexSelector = 'first';
                method = "before";
                break;
            default:
                indexSelector = `nth-of-type(${index})`;
                method = "after";
                break;
        }

        $newItem.addClass(`item_${item.id}`);

        $newItem.find("[data-property]").each(function() {
            let prop = $(this).data("property");
            if (item[prop]) {
                $(this).html(item[prop]);
            }
        });

        let $relativeItem = this.$itemContainer.find(`.item-template:${indexSelector}`);
        if ($relativeItem.length > 0) {
            $relativeItem[method]($newItem);
        } else {
            this.$itemContainer.append($newItem);
        }
    }

    /**
     * Remove an item from the list.  Will use item.id to find it in the DOM.
     * @param {Object} item item to be removed
     * @param {number} item.id ID of the item.  Must exist for lookups.
     */
    removeItem(item) {
        this.$itemContainer.find(`.item-template.item_${item.id}`).remove();
    }

    /**
     * Remove all items from the ItemContainer.
     */
    clear() {
        this.$itemContainer.find(".item-template").remove();
    }

    /**
     * Display the full items array for the collection.
     * Do this for the initial display.  After the initial display, the event listener will handle adds and deletes.
     */
    displayItemsArray() {
        for (let i = 0, len = this.collection.count(); i < len; ++i) {
            this.displayItem(this.collection.getAt(i), -1);
        }
    }

    /**
     * Listener for when the collection has changed.
     * @param {CollectionChangedEventArgs} args
     */
    collectionChanged(args) {
        switch(args.changeType) {
            case "insert":
                this.displayItem(args.value, args.index);
                break;
            case "remove":
                this.removeItem(args.value);
                break;
            case "clear":
                this.clear();
                break;
        }
    }

    /**
     * Bind methods to "this", particularly event listeners, which will have the wrong context by default.
     */
    bindMethods() {
        this.collectionChanged = _.bind(this.collectionChanged, this);
    }

    /**
     * Add event listeners for this widget.
     */
    addEventListeners() {
        this.collection.collectionChanged.add(this.collectionChanged);
    }

    /**
     * Remove event listeners from this widget.
     */
    removeEventListeners() {
        this.collection.collectionChanged.remove(this.collectionChanged);
    }

    pullValue() {
        // Empty method... for now.
    }

    pushValue() {
        // Empty method... for now.
    }

    /**
     * Clean up this control.  Remove all DOM elements, event listeners, and object references.
     */
    destroy() {
        this.removeEventListeners();
        this.$itemContainer.remove();
        this.$itemContainer = null;
        this.collection = null;
        this.itemTemplate = null;
        super.destroy();
    }
}