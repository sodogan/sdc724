sap.ui.define([],function ()
    {
     "use strict";
     var settings = function() {};
     
    //Gobal Mode either Debug Mode on or off!
     settings.prototype.debugMode = true;

     settings.prototype.SwitchDebugModeOn = function(){
         this.debugMode =true;
     }
     settings.prototype.SwitchDebugModeOff = function(){
        this.debugMode = false;
    }

     return settings;

    },true);

