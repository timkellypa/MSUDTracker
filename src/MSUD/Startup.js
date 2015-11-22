import "font-awesome-webpack";

import Router from "./UI/Routes/Router";
import AppDatabase from "./Data/AppDatabase";
import Config from "./Config";
import FoodData from "!!raw!./Data/Bootstrap/FoodData.json";
import FoodDiaryEntryData from "!!raw!./Data/Bootstrap/Test/FoodDiaryEntryData.json";
import PersonalInfoData  from "!!raw!./Data/Bootstrap/Test/PersonalInfoData.json";
import "./Assets/Less/main.less";

/**
 * Class that starts up the app.
 */
export default class Startup {
    /**
     * Starts the application
     */
    static start() {
        let db,
            foodInitialData,
            foodDiaryEntryInitialData,
            personalInfoInitialData;

        // Initialize data and database
        foodInitialData = JSON.parse(FoodData);
        if (Config.Globals.loadTestData) {
            foodDiaryEntryInitialData = JSON.parse(FoodDiaryEntryData);
            personalInfoInitialData = JSON.parse(PersonalInfoData);
        }

        db = new AppDatabase(Config.Globals.databaseName,
                             foodInitialData,
                             foodDiaryEntryInitialData,
                             personalInfoInitialData);

        db.init()
            .then(
            function () {
                // Now start up our router
                var r = new Router();
                r.init();
            }
        ).catch((e) => {
                    throw e;
                });
    }
}