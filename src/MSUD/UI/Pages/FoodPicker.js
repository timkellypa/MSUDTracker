import IPage from "../../../Core/UI/IPage";
import Toolbar from "../Toolbar";
import Menu from "../Menu";
import menuTemplate from "!!raw!../../UI/Templates/MainMenu.html";
import FoodViewModel from "../../../MSUD/ViewModel/FoodViewModel";
import Form from "../../../Core/UI/Widgets/Form";
import foodListTemplate from "!!raw!../../UI/Templates/FoodList.html";

import $ from "jquery";

export default class FoodPicker extends IPage {
    constructor() {
        super();

        this.context = new FoodViewModel();
    }

    show(options) {
        let that = this,
            foodPickerForm;
        return super.show(options).then(() => {
            return that.context.init();
        }).then(() => {
            Toolbar.setTitle("Add Food");

            $($("#content")[0]).on("click", Menu.menuOff);

            Toolbar.setMenuIconHandler(Menu.menuOn);

            Menu.buildFromTemplate(menuTemplate);

            foodPickerForm = new Form(this.context);
            return foodPickerForm.show({template: foodListTemplate, container: that.$el[0]});
        });
    }
}