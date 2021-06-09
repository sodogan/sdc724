sap.ui.require([
    "sap/ui/core/mvc/Controller",
    "demo/ui5/TodModApp/controller/custom",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
], function (Controller,custom,UIComponent,History) {
    "use strict";

    console.log(custom);
    return Controller.extend("demo.ui5.TodModApp.controller.Detail", 
    {
        onBackPressed: function(){
          //history.go(-1);
           //Need to go to the previous view!
           var oHistory = History.getInstance();
   
           //check the previous hash
           console.log(oHistory);
           if( oHistory.getPreviousHash()!==undefined)
            {
                console.log('inside if');
                console.log(`ınside previous Hash ${oHistory.getPreviousHash()}`);  
                oHistory.go(-1);   
            }
            else{
                var oRouter = UIComponent.getRouterFor(this);

                console.log('inside else');
                console.log(oRouter);
                // use route name 'detail' here
                oRouter.navTo("to_header",{},true); 
               
            }
   

        }
        
    });
});