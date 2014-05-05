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

    fluid.defaults("fluid.tests.transcriptsPanelTests", {
        gradeNames: ["fluid.tests.resourceInputPanelTests", "autoInit"],
        components: {
            resourceInputPanel: {
                type: "fluid.metadata.transcriptsPanel",
                container: ".gpiic-transcriptsPanel"
            }
        }
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.tests.transcriptsPanelTests"
        ]);
    });

})(jQuery);