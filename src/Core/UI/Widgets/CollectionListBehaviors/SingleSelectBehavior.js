import _ from "underscore";
import $ from "jquery";

export default class SingleSelectBehavior {

    /**
     *
     * @param {CollectionList} collectionList
     */
    constructor(collectionList) {
        this.collectionList = collectionList;
        this.bindMethods();
    }

    init() {
        this.addEventListeners();
    }

    itemSelected() {
        let value = this.collectionList.value.getValue();
        $(".item").each(function() {
            this.classList.remove("selected");
        });
        $(`.item-${value}`).each(function() {
            this.classList.add("selected");
        });
    }

    selectItem(element) {
        for (let i = 0, len = element.classList.length; i < len; ++i) {
            let classParts = element.classList[i].split("-");
            if (classParts.length > 1 && classParts[0] === "item") {
                this.collectionList.value.setValue(classParts[1]);
                break;
            }
        }
    }

    handleClick(e) {
        let that = this;
        $(e.target).closest(".item").each(function() {
            that.selectItem(this);
        });
    }

    bindMethods() {
        this.handleClick = _.bind(this.handleClick, this);
        this.itemSelected = _.bind(this.itemSelected, this);
    }

    addEventListeners() {
        this.collectionList.$el.on("click", this.handleClick);
        this.collectionList.value.valueChanged.add(this.itemSelected);
    }

    removeEventListeners() {
        this.collectionList.$el.off("click", this.handleClick);
        this.collectionList.value.valueChanged.remove(this.itemSelected);
    }

    destroy() {
        this.removeEventListeners();
    }
}