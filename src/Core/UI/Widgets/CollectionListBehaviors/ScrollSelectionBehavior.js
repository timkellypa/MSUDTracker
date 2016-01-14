import * as _ from "underscore";
import $ from "jquery";
import IScroll from "iscroll";

export default class ScrollSelectionBehavior {

    /**
     *
     * @param {CollectionList} collectionList
     * @param {object} [options={}] options passed into this control
     */
    constructor(collectionList, options = {}) {
        this.collectionList = collectionList;

        this.scroller = null;

        this.numItems = options.numItems || null;

        this.min = options.min || 0;
        this.max = options.max || 100;
        this.step = options.step || 1;

        this.itemHeight = null;

        this.fieldHeight = null;

        this.userInitiatedScroll = false;

        this.selectedItem = null;

        this.bindMethods();

        if (this.collectionList.value.getValue() === null) {
            this.collectionList.value.setValue("");
        }
    }

    setHeights() {
        this.itemHeight = this.collectionList.$itemContainer.find(".item")['outerHeight']();

        if (this.numItems) {
            this.fieldHeight = this.itemHeight * this.numItems;
            this.collectionList.$itemContainer.parent()(this.fieldHeight);
        }
        else {
            this.fieldHeight = this.collectionList.$el.height();
        }
    }

    setEmptyAreas() {
        let bufferHeight = (this.fieldHeight / 2.0) - (this.itemHeight / 2.0);
        this.collectionList.$itemContainer.prepend(`<div class="buffer-item" style="height:${bufferHeight}px;">&nbsp;</div>`);
        this.collectionList.$itemContainer.append(`<div class="buffer-item" style="height:${bufferHeight}px;">&nbsp;</div>`);
    }

    setValues() {
        for (let i = this.min; i <= this.max; i += this.step) {
            this.collectionList.collection.insert({id: i, value: i});
        }
    }

    init() {
        this.setValues();

        this.setHeights();

        this.setEmptyAreas();

        this.collectionList.$itemContainer.ready(() => {
            this.scroller = new IScroll(this.collectionList.$itemContainer.parent()[0], {
                deceleration: 0.0006,
                tap: true
            });
            this.addEventListeners();
        });

    }

    updateSelectedItemUI() {
        let value = this.collectionList.value.getValue();
        this.collectionList.$itemContainer.find(`.item`).each(function () {
            if ($(this).data("value") == value) {
                this.classList.add("selected");
                // break out after first find.
                return false;
            }
        });
        if (value !== "" && value !== null) {
            this.removeBlankItem();
            this.scroller.refresh();
        }
    }

    pullValue() {
        let value = this.collectionList.value.getValue(),
            that = this;
        this.collectionList.$itemContainer.find(".item").each(function () {
            let $this = $(this);
            this.classList.remove("selected");

            if ($this.data("value") == value) {
                let top = $this.position().top,
                    height = $this.height(),
                    curScrollY = that.scroller.y,
                    targetScrollTop;

                that.selectedItem = this;
                targetScrollTop = -(top - ((that.fieldHeight / 2.0) - (height / 2.0)));
                if (targetScrollTop !== curScrollY) {
                    that.scroller.scrollTo(0, targetScrollTop, 250);
                }
                else {
                    that.updateSelectedItemUI();
                }
            }
        });
    }

    removeBlankItem() {
        let that = this;
        this.collectionList.$itemContainer.find(".item")
            .filter(function () {
                return $(this).data("value") == "";
            })
            .each(function () {
                let $this = $(this),
                    height = $this.outerHeight();
                $this.remove();
                that.scroller.scrollBy(0, height, 0);
            });
    }

    pushValue() {
        if (this.selectedItem == null) {
            this.collectionList.value.setValue(null);
        }
        else {
            this.collectionList.value.setValue($(this.selectedItem).data("value"));
            this.pullValue();
        }
    }

    handleBeforeScrollStart() {
        this.userInitiatedScroll = true;
    }

    handleScrollStart() {
        if (!this.userInitiatedScroll) {
            return;
        }
        this.collectionList.value.setValue(null);
        this.collectionList.pullValue();
    }

    handleScrollEnd() {
        if (!this.userInitiatedScroll) {
            // Auto scroll to snap.  Style when finished.
            this.updateSelectedItemUI();
            return;
        }
        else {
            // for next time
            this.userInitiatedScroll = false;
        }

        // Determine which item is in the middle.
        let relY = this.fieldHeight / 2.0,
            that = this;

        // find item in the middle
        this.collectionList.$itemContainer.find(".item")
            .filter(
                function () {
                    let top = $(this).position().top + that.scroller.y,
                        height = $(this).height();
                    return top <= relY && top + height > relY;
                }
            ).each(
            function () {
                that.selectedItem = this;
                that.pushValue();
            }
        );
    }

    handleTap(e) {
        let that = this;
        $(e.target).closest(".item").each(function () {
            that.userInitiatedScroll = false;
            that.selectedItem = this;
            that.pushValue();
        });
    }

    bindMethods() {
        this.pullValue = _.bind(this.pullValue, this);
        this.pushValue = _.bind(this.pushValue, this);
        this.handleScrollEnd = _.bind(this.handleScrollEnd, this);
        this.handleScrollStart = _.bind(this.handleScrollStart, this);
        this.handleBeforeScrollStart = _.bind(this.handleBeforeScrollStart, this);
        this.handleTap = _.bind(this.handleTap, this);

        // Special case... overrides pushValue
        this.collectionList.pullValue = this.pullValue;
        this.collectionList.pushValue = this.pushValue;
    }

    addEventListeners() {
        this.scroller.on("scrollEnd", this.handleScrollEnd);
        this.scroller.on("beforeScrollStart", this.handleBeforeScrollStart);
        this.scroller.on("scrollStart", this.handleScrollStart);
        this.collectionList.$itemContainer.on("tap", this.handleTap);
    }

    removeEventListeners() {
        this.scroller.off("scrollEnd", this.handleScrollEnd);
        this.scroller.off("beforeScrollStart", this.handleBeforeScrollStart);
        this.scroller.off("scrollStart", this.handleScrollStart);
        this.collectionList.$itemContainer.off("tap", this.handleTap);
    }

    destroy() {
        this.removeEventListeners();
        this.scroller.destroy();
        this.scroller = null;
        this.collectionList = null;
        this.selectedItem = null;
    }
}