sap.ui.require(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/base/Log",
    "demo/ui5/TodModApp/controller/formatter",
    "demo/ui5/TodModApp/controller/utility",
    "demo/ui5/TodModApp/controller/devSettings",
  ],
  function (Controller, JSONModel, MessageToast, Log, formatter, utility,devSettings) {
    "use strict";

    var appController = Controller.extend("demo.ui5.TodModApp.controller.App", {

      formatter: formatter,
      utility: utility,//can include like this
      devSettings: devSettings,

      onInit: function () {

        //Set the Applicaion Mode here- can be debug Mode on or Off!
        this._devSettings =  new this.devSettings();
        const currentView = this.getView();
        
        if(this._devSettings.debugMode){
          debugger;
          Log.info("-->APP Controller -onINIT() is called");
        }
       //create a Model to be accessed by this object! 
        this._oModel = new JSONModel({
          templates: [],
          modules: [],
          users: [],
          instructions: [],
          tickets: []
          });
 
        //set the model to the whole Page! 
        currentView.setModel(this._oModel);

        let currentBundle = currentView.getModel("i18n").getResourceBundle();
        //let text = currentBundle.getText("searchPageTitle", []);

        //let templatesModel = new JSONModel(sap.ui.require.toUrl("demo/ui5/TodModApp/model/templates.json"));
        //this._oModel.setProperty("/templates", templatesModel.getData());


        // load the models-from the Mock Json model at the models folder
        this.asyncLoadMockData("./model/templates.json", "/templates");
        this.asyncLoadMockData("./model/modules.json", "/modules");
        this.asyncLoadMockData("./model/users.json", "/users");
        this.asyncLoadMockData("./model/instructions.json", "/instructions");

        const serviceNowURL = "https://cors-anywhere.herokuapp.com/https://dev64357.service-now.com/api/now/table/ticket";

        //fetch the Tickets from the external source-ServiceNow! 
        this.fetchAsyncTicketsFromServiceNowAPI(serviceNowURL, "/tickets");
      },

      // use async function to call getAPIData promise function
      asyncLoadMockData: async function (url, property) {
        try {
          console.log('inside the asynch await');
          // call promise to get data
          var response = await fetch(url);
          // convert to json format
          var data = await response.json();

          // update model data
          this._oModel.setProperty(property, data);
        } catch (err) {
          console.log(err);
          MessageToast.show(err.message);
        }
      },
      fetchAsyncTicketsFromServiceNowAPI: async function (URL, property) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic YWRtaW46WjR0Y1BsVFBwUXY1");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        try {
          console.log('inside the asynch await');
          // call promise to get data
          var response = await fetch(URL, requestOptions);
          // convert to json format
          var data = await response.json();
          var result = data.result;
          console.log('response successfull' + result);

          // update model data
          this._oModel.setProperty(property, result);
        } catch (err) {
          console.log(err);
          MessageToast.show(err.message);

        }
      },
      fetchTicketsFromServiceNow: function (serviceNowURL, property) {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic YWRtaW46WjR0Y1BsVFBwUXY1");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Access-Control-Allow-Headers", "x-requested-with, x-requested-by");
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          "crossDomain": true
          //  redirect: 'follow'
        };

        fetch(serviceNowURL, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            // update model data
            thisRef._oModel.setProperty(property, result);
          })
          .catch(error => console.log('error', error));
      },
      onBeforeRendering: function () {
        if(this._devSettings)
             Log.info("APP on BEFORE RENDERING is called");
        
      },

      onAfterRendering: function () {
        if(this._devSettings)
        Log.info("APP afterRendering is called");
      },

      onExit: function () {
        if(this._devSettings)
          Log.info("APP on EXIT is called");
      },
      parseDate:function(){
        jQuery.sap.require("sap.ui.core.format.DateFormat");
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY/MM/DD" });
        var dateFormatted = dateFormat.format(new Date());
        console.log(`Formatted date is ${dateFormatted}`);

      }
    });
    return appController;
  }
);
