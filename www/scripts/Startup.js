define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

define(function (require) {
    "use strict";
    return function () {
        var Router = require("UI/Routes/Router"),
            AppDatabase = require("Data/AppDatabase"),
            Config = require("Config"),
            FoodData = require("text!Data/Bootstrap/FoodData.json"),
            FoodDiaryEntryData = require("text!Data/Bootstrap/Test/FoodDiaryEntryData.json"),
            PersonalInfoData = require("text!Data/Bootstrap/Test/PersonalInfoData.json"),
            db,
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
        );
    };
});
