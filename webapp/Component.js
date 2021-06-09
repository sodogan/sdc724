sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "demo/ui5/TodModApp/model/models"
], function (UIComponent, Device, models) {
    "use strict";

    return UIComponent.extend("demo.ui5.TodModApp.Component", {
        // load the manifest.json app descriptor file
        metadata: {
            manifest: "json"
        },


        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }

    });
});