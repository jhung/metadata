/*!
Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/*global fluid, jqUnit, expect, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {
    fluid.registerNamespace("fluid.tests");

    jqUnit.module("Metadata Model Transformation");

    var invertConditionTests = [{
        message: "A conditional transform with inversion",
        rules: {
            transform: {
                type: "fluid.metadata.transforms.condition",
                conditionPath: "hasHazard",
                "true": {
                    transform: {
                        type: "fluid.transforms.literalValue",
                        value: "flashing",
                        outputPath: "hazard"
                    }
                },
                "false": {
                    transform: {
                        type: "fluid.transforms.literalValue",
                        value: "noflashing",
                        outputPath: "hazard"
                    }
                }
            }
        },
        invertedRules: {
            transform: [{
                type: "fluid.transforms.valueMapper",
                inputPath: "hazard",
                options: {
                    "flashing": {
                        outputValue: {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "hasHazard"
                            }]
                        }
                    },
                    "noflashing": {
                        outputValue: {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: false,
                                outputPath: "hasHazard"
                            }]
                        }
                    }
                }
            }]
        },
        expectPerfectInversion: true,
        model: {
            hasHazard: true
        },
        expected: {
            hazard: "flashing"
        },
        method: "assertDeepEq"
    }, {
        message: "A nested conditional transform with inversion",
        rules: {
            transform: {
                type: "fluid.metadata.transforms.condition",
                conditionPath: "audio",
                "true": {
                    transform: {
                        type: "fluid.metadata.transforms.condition",
                        conditionPath: "sound",
                        "true": {
                            transform: {
                                type: "fluid.transforms.literalValue",
                                value: "available",
                                outputPath: "audio"
                            }
                        },
                        "false": {
                            transform: {
                                type: "fluid.transforms.literalValue",
                                value: "unknown",
                                outputPath: "audio"
                            }
                        }
                    }
                },
                "false": {
                    transform: {
                        type: "fluid.metadata.transforms.condition",
                        conditionPath: "nosoundHazard",
                        "true": {
                            transform: {
                                type: "fluid.transforms.literalValue",
                                value: "unavailable",
                                outputPath: "audio"
                            }
                        }
                    }
                }
            }
        },
        invertedRules: {
            transform: [{
                type: "fluid.transforms.valueMapper",
                inputPath: "audio",
                options: {
                    "available": {
                        "outputValue": {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "audio"
                            }, {
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "sound"
                            }]
                        }
                    },
                    "unknown": {
                        "outputValue": {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "audio"
                            }, {
                                type: "fluid.transforms.literalValue",
                                value: false,
                                outputPath: "sound"
                            }]
                        }
                    },
                    "unavailable": {
                        "outputValue": {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: false,
                                outputPath: "audio"
                            }, {
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "nosoundHazard"
                            }]
                        }
                    }
                }
            }]
        },
        expectPerfectInversion: true,
        model: {
            audio: false,
            nosoundHazard: true
        },
        expected: {
            audio: "unavailable"
        },
        method: "assertDeepEq"
    }];

    var testInvertConditions = function (json) {
        var description = json.message;
        var transformed = fluid.model.transformWithRules(json.model, json.rules);
        jqUnit.assertDeepEq(description + " forward transformation", json.expected, transformed);
        var inverseRules = fluid.model.transform.invertConfiguration(json.rules);
        jqUnit.assertDeepEq(description + " inverted rules", json.invertedRules, inverseRules);
        if (json.expectPerfectInversion === true) {
            var inverseTransformed = fluid.model.transformWithRules(json.expected, json.invertedRules);
            jqUnit.assertDeepEq(description + " inverted transformation", json.model, inverseTransformed);
        }
    };

    jqUnit.test("Customized invertible conditional transform tests", function () {
        fluid.each(invertConditionTests, function (v) {
            testInvertConditions(v);
        });
    });

    fluid.defaults("fluid.tests.inversionInRelay", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],
        model: {
            noflashing: false
        },
        components: {
            sub: {
                type: "fluid.standardRelayComponent",
                options: {
                    modelRelay: [{
                        source: "{inversionInRelay}.model",
                        target: "{that}.model",
                        singleTransform: {
                            type: "fluid.metadata.transforms.condition",
                            conditionPath: "flashing",
                            "true": {
                                transform: {
                                    type: "fluid.transforms.literalValue",
                                    value: "flashing",
                                    outputPath: "flashing"
                                }
                            },
                            "false": {
                                transform: {
                                    type: "fluid.metadata.transforms.condition",
                                    conditionPath: "noflashing",
                                    "true": {
                                        transform: {
                                            type: "fluid.transforms.literalValue",
                                            value: "noflashing",
                                            outputPath: "flashing"
                                        }
                                    },
                                    "false": {
                                        transform: {
                                            type: "fluid.transforms.literalValue",
                                            value: "unknown",
                                            outputPath: "flashing"
                                        }
                                    }
                                }
                            }
                        }
                    }]
                }
            }
        }
    });

    jqUnit.test("Model relay with the customized invertible conditional transform", function () {
        var that = fluid.tests.inversionInRelay();
        var expectedSubModel = {
            flashing: "unknown"
        };

        jqUnit.assertDeepEq("The initial forward transformation is performed correctly", expectedSubModel, that.sub.model);

        var expectedTransformedSubModel = {
            "flashing": "noflashing"
        };
        that.applier.requestChange("noflashing", true);
        jqUnit.assertDeepEq("The relay is performed correctly when a change request is issued at the top model", expectedTransformedSubModel, that.sub.model);

        var expectedTransformedTopModel = {
            "flashing": true,
            "noflashing": true
        };
        that.sub.applier.requestChange("flashing", "flashing");
        jqUnit.assertDeepEq("The backward transformation is performed correctly", expectedTransformedTopModel, that.model);
    });

})(jQuery);