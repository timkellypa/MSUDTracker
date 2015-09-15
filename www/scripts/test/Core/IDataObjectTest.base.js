/*globals describe, it, assert, beforeEach */
define(function (require) {
    "use strict";
    var IDataObjectTest;

    /**
     * DataObject Tests
     * @namespace
     * @memberof Test.Core
     */
    IDataObjectTest = {
        /**
         * Execute tests
         * @param {function(new:window.Core.IDataObject)} Obj inherited class, on which to run tests on core
         * @param {Object} initialData data for our object.
         * @param {Object} [foreignKeyInfo] all info needed for an "include" test (foreign key).
         * @param {window.Core.IDataCollection} foreignKeyInfo.collection IDatacollection for the foreignKeyInfo object
         * @param {string} foreignKeyInfo.className class name of the foreignkeyInfo object
         * @param {string} foreignKeyInfo.key foreign key of the foreignkeyInfo object
         */
        execute: function (Obj, initialData, foreignKeyInfo) {
            var IDataObject = require("../../Core/IDataObject"),
                testObj;

            describe('Core.IDataObject', function() {

                if (!testObj) {
                    it("should be tested with fully inherited object as a parameter", function () {
                        assert.equal(true, true);
                    });
                }
                else {
                    beforeEach("Create inherited object", function () {
                        testObj = new Obj(initialData);
                    });

                    describe("Object to be tested", function () {
                        it("is an IDataObject", function () {
                            assert.equal(testObj instanceof IDataObject, true);
                        });
                    });

                    describe("#getPropertyObject()", function () {
                        it("matches our test object", function () {
                            assert.deepEqual(testObj.getPropertyObject(), initialData);
                        });
                    });

                    if (foreignKeyInfo) {
                        describe("#include", function () {
                            it("includes a foreign object", function (done) {
                                testObj.include(
                                    null,
                                    foreignKeyInfo.key,
                                    foreignKeyInfo.collection
                                ).then(
                                    function (val) {
                                        // Just verify the ID of the object we got is the same as our foreign key.
                                        assert.equal(val[foreignKeyInfo.className].id, val[foreignKeyInfo.key]);
                                        done();
                                    }
                                );
                            });
                        });
                    }
                }
            });
        }
    };
    return IDataObjectTest;
});