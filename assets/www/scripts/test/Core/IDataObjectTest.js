define = define || null;
if (typeof define !== 'function') {
    define = require('amdefine')(module);
}

/*globals describe, it */
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
         * @param {window.Core.IDataObject} testObj inherited object, on which to run tests on core
         * @param {Object} [foreignKeyInfo] all info needed for an "include" test (foreign key).
         * @param {window.Core.IDataCollection} foreignKeyInfo.collection IDatacollection for the foreignKeyInfo object
         * @param {string} foreignKeyInfo.className class name of the foreignkeyInfo object
         * @param {string} foreignKeyInfo.key foreign key of the foreignkeyInfo object
         */
        execute: function (testObj, foreignKeyInfo) {
            var assert = require("assert"),
                _ = require("underscore"),
                IDataObject = require("../../Core/IDataObject");

            describe('Core.IDataObject', function() {
                if (!testObj) {
                    it("should be tested with fully inherited object as a parameter", function () {
                        assert.equal(true, true);
                    });
                }
                else {
                    describe("Object to be tested", function () {
                        it("is an IDataObject", function () {
                            assert.equal(testObj instanceof IDataObject, true);
                        });
                    });

                    describe("#save", function () {
                        it("saves an object", function (done) {
                            testObj.save(
                            ).then(
                                function () {
                                    return testObj.collection.getItemById(testObj.id);
                                }
                            ).then(
                                function (val) {
                                    assert.equal(_.isMatch(val, testObj), true);
                                    done();
                                }
                            );
                        });
                    });

                    describe("#remove", function () {
                        it("removes an object", function (done) {
                            testObj.remove(
                            ).then(
                                function () {
                                    return testObj.collection.getItemById(testObj.id);
                                }
                            ).then(
                                function (val) {
                                    assert.equal(val, null);
                                    done();
                                }
                            );
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