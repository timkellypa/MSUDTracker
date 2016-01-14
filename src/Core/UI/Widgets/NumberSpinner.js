import CollectionList from "./CollectionList";
import ScrollSelectionBehavior from "./CollectionListBehaviors/ScrollSelectionBehavior";


export default class NumberSpinner extends CollectionList {
    constructor(options) {
        super(options);
        let hasScrollBehavior = false;
        for (let i = 0; i < (options.behaviors || []).length; ++i) {
            if (options.behaviors[i] instanceof ScrollSelectionBehavior) {
                hasScrollBehavior = true;
                break;
            }
        }
        if (!hasScrollBehavior) {
            this.behaviors.push(new ScrollSelectionBehavior(this, options));
        }
    }
}