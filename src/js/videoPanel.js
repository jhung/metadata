/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_5:true, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};


(function ($, fluid) {

    fluid.registerNamespace("fluid.metadata");

    /*******************************************************************************
     * The panel to define video related metadata
     *******************************************************************************/

    fluid.defaults("fluid.metadata.videoPanel", {
        gradeNames: ["fluid.rendererRelayComponent", "fluid.metadata.basePanel", "autoInit"],
        components: {
            indicator: {
                createOnEvent: "afterRender",
                priority: "first",
                options: {
                    model: {
                        value: "available"
                    }
                }
            }
        },
        model: {
            highContrast: false,
            signLanguage: false,
            flashing: "unknown" // flashing, noFlashing are other possible values
        },
        strings: {
            title: "Video",
            instruction: "Select all that apply",
            highContrastLabel: "Video is high contrast which may improve visibility.",
            signLangLabel: "Video contains sign language translation.",
            flashingLabel: "Video has flashing visuals that some users may want to avoid",
            flashing: ["Yes", "No", "Not sure"]
        },
        controlValues: ["flashing", "noFlashing", "unknown"],
        selectors: {
            title: ".gpiic-video-title",
            indicator: ".gpiic-video-icon",
            instruction: ".gpiic-instruction",
            highContrast: ".gpiic-highContrast",
            highContrastLabel: ".gpiic-highContrast-label",
            signLang: ".gpiic-signLang",
            signLangLabel: ".gpiic-signLang-label",
            flashingLabel: ".gpiic-flashing-label",
            flashingRow: ".gpiic-flashing-row",
            flashingInput: ".gpiic-flashing-input",
            flashingRowLabel: ".gpiic-flashingRow-label"
        },
        selectorsToIgnore: ["indicator"],
        repeatingSelectors: ["flashingRow"],
        protoTree: {
            title: {messagekey: "title"},
            instruction: {messagekey: "instruction"},
            flashingLabel: {messagekey: "flashingLabel"},
            highContrastLabel: {messagekey: "highContrastLabel"},
            highContrast: "${highContrast}",
            signLangLabel: {messagekey: "signLangLabel"},
            signLang: "${signLanguage}",
            expander: {
                type: "fluid.renderer.selection.inputs",
                rowID: "flashingRow",
                labelID: "flashingRowLabel",
                inputID: "flashingInput",
                selectID: "flashing-radio",
                tree: {
                    optionnames: "${{that}.options.strings.flashing}",
                    optionlist: "${{that}.options.controlValues}",
                    selection: "${flashing}"
                }
            }
        },
        resources: {
            template: {
                url: "../html/video-template.html",
                forceCache: true
            }
        },
        events: {
            onReady: {
                events: {
                    onCreate: "onCreate",
                    afterRender: "afterRender"
                },
                args: "{that}"
            }
        },
        listeners: {
            "onCreate.init": "fluid.metadata.videoPanel.init"
        },
        distributeOptions: {
            source: "{that}.options.videoTemplate",
            target: "{that}.options.resources.template.url"
        }
    });

    fluid.metadata.videoPanel.init = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.refreshView();
        });
    };

})(jQuery, fluid_1_5);
