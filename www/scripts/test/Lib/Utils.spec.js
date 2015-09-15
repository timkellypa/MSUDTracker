/*globals describe, it, before, setTimeout, assert */
define(function (require) {
    "use strict";
    var Utils = require("Lib/Local/Utils");

    describe('Utils', function () {
        describe('#inherit()', function () {
            var ChildObj,
                ParentObj,
                testInstance;

            ChildObj = function () {
                ChildObj.$Super.constructor.apply(this, arguments);
                this.childInitialized = true;
            };
            ChildObj.prototype.hasChildStuff = true;

            ParentObj = function () {
                this.parentInitialized = true;
            };
            ParentObj.prototype.hasParentStuff = true;

            Utils.inherit(ChildObj, ParentObj);

            testInstance = new ChildObj();

            it("is instanceof both classes", function () {
                assert.equal(testInstance instanceof ChildObj, true);
                assert.equal(testInstance instanceof ParentObj, true);
            });

            it("contains info from both constructors", function () {
                assert.equal(testInstance.childInitialized, true);
                assert.equal(testInstance.parentInitialized, true);
            });

            it("contains info from both prototypes", function () {
                assert.equal(testInstance.hasChildStuff, true);
                assert.equal(testInstance.hasParentStuff, true);
            });
        });
        describe("#getEpochDayFromTime(), #getDayFromEpochTime()", function () {
            it("represents a calendar date when called on the 0th ms of the date", function () {
                var dt,
                    epochDay,
                    time;

                dt = new Date();
                dt.setFullYear(2015, 4, 15);
                dt.setHours(0, 0, 0, 0);

                epochDay = Utils.getEpochDayFromTime(dt.getTime());

                time = Utils.getTimeFromEpochDay(epochDay);

                assert.equal(time, dt.getTime());
            });

            it("represents a calendar date when called on the last ms of the date", function () {
                var dt,
                    epochDay,
                    time;

                dt = new Date();
                dt.setFullYear(2015, 4, 15);
                dt.setHours(23, 59, 59, 999);

                epochDay = Utils.getEpochDayFromTime(dt.getTime());

                time = Utils.getTimeFromEpochDay(epochDay);

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

                epochDay = Utils.getEpochDayFromTime(dt.getTime());

                dt = new Date();
                dt.setFullYear(2015, 4, 15);
                dt.setHours(23, 59, 59, 999);

                epochDay2 = Utils.getEpochDayFromTime(dt.getTime());

                assert.equal(epochDay2 + 1, epochDay);
            });
        });
        describe("#fullDateFormat()", function () {
            it("returns date in standard date format", function () {
                var dt = new Date(),
                    formatted;

                dt.setFullYear(2010, 4, 15);

                formatted = Utils.fullDateFormat(dt);

                // Note: Test may need to change when locale is involved.
                assert.equal(formatted, "Saturday, May 15, 2010");
            });
        });

        describe("#getPromiseLib()", function () {
            it("returns a require of rsvp", function () {
                assert.equal(Utils.getPromiseLib(), require("rsvp"));
            });
        });

        describe("#createPromise()", function () {
            it("returns an instance of a promise", function () {
                var p = Utils.createPromise(function (success, error) {
                    try {
                        success();
                    }
                    catch (e) {
                        error(e);
                    }
                }, "label");
                assert.equal(p instanceof Utils.getPromiseLib().Promise, true);
            });
        });
    });
});
