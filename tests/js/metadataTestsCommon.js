/*!
Copyright 2014 OCAD University

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

    fluid.tests.findRendererSubcomponent = function (that, componentName) {
        return fluid.find(that, function (ignored, name) {
            if (name.indexOf(componentName) >= 0) {
                return true;
            }
        }) === true;
    };

    fluid.tests.checkRenderedVideoMetadataPanel = function (videoMetadataPanel) {
        jqUnit.assertDeepEq("The video default model has been set", fluid.defaults("fluid.metadata.defaultVideoModel").members.defaultModel, videoMetadataPanel.defaultModel);
        jqUnit.assertNotEquals("The video panel has been rendered", "", videoMetadataPanel.locate("videoPanel").html());
        jqUnit.assertNotEquals("The audio panel has been rendered", "", videoMetadataPanel.locate("audioPanel").html());
        jqUnit.assertNotEquals("The captions panel has been rendered", "", videoMetadataPanel.locate("captionsPanel").html());
    };

    fluid.tests.checkNotRenderedVideoMetadataPanel = function (videoMetadataPanel) {
        jqUnit.assertDeepEq("The video default model has been set", fluid.defaults("fluid.metadata.defaultVideoModel").members.defaultModel, videoMetadataPanel.defaultModel);
        jqUnit.assertFalse("The video panel has not been rendered", fluid.tests.findRendererSubcomponent(videoMetadataPanel, "renderer-videoPanel"));
        jqUnit.assertFalse("The video panel has not been rendered", fluid.tests.findRendererSubcomponent(videoMetadataPanel, "renderer-audioPanel"));
        jqUnit.assertFalse("The video panel has not been rendered", fluid.tests.findRendererSubcomponent(videoMetadataPanel, "renderer-captionsPanel"));
    };

})(jQuery);
