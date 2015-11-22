/*globals describe, it, before, setTimeout, assert */
define(function (require) {
    "use strict";
    var DateHelpers = require("../../../Core/Lib/DateHelpers");

    describe('DateHelpers', function () {
        describe("#getEpochDayFromTime(), #getDayFromEpochTime()", function () {
            it("represents a calendar date when called on the 0th ms of the date", function () {
                var dt,
                    epochDay,
                    time;

                dt = new Date();
                dt.setFullYear(2015, 4, 15);
                dt.setHours(0, 0, 0, 0);

                epochDay = DateHelpers.getEpochDayFromTime(dt.getTime());

                time = DateHelpers.getTimeFromEpochDay(epochDay);

                assert.equal(time, dt.getTime());
            });

            it("represents a calendar date when called on the last ms of the date", function () {
                var dt,
                    epochDay,
                    time;

                dt = new Date();
                dt.setFullYear(2015, 4, 15);
                dt.setHours(23, 59, 59, 999);

                epochDay = DateHelpers.getEpochDayFromTime(dt.getTime());

                time = DateHelpers.getTimeFromEpochDay(epochDay);

                dt.setHours(0, 0, 0, 0);
                assert.equal(time, dt.getTime());
            });

            it("epoch day of last ms of previous day is first ms of next day minus 1", function () {
                var dt,
                    epochDay,
                    epochDay2;

                dt = new Date();
                dt.setFullYear(2015, 4, 16);
                dt.setHours(0, 0, 0, 0);

                epochDay = DateHelpers.getEpochDayFromTime(dt.getTime());

                dt = new Date();
                dt.setFullYear(2015, 4, 15);
                dt.setHours(23, 59, 59, 999);

                epochDay2 = DateHelpers.getEpochDayFromTime(dt.getTime());

                assert.equal(epochDay2 + 1, epochDay);
            });
        });
        describe("#fullDateFormat()", function () {
            it("returns date in standard date format", function () {
                var dt = new Date(),
                    formatted;

                dt.setFullYear(2010, 4, 15);

                formatted = DateHelpers.fullDateFormat(dt);

                // Note: Test may need to change when locale is involved.
                assert.equal(formatted, "Saturday, May 15, 2010");
            });
        });
    });
});
