sap.ui.define("utility",[],function ()
    {
     "use strict";
     var utility = function() {};

     utility.prototype.getControlbyID = function(id){
         let controlObj = this.getView().byId(id);
         return controlObj;
     }

     return utility;

    },true);

