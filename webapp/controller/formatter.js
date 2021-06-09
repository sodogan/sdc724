sap.ui.define([], function () {
	"use strict";

	var formatObj = {};

	formatObj.formatTitle = function(template,businessArea){
		if(template && businessArea){
			return jQuery.sap.charToUpperCase(template) +'<' + businessArea+'>';
		}
		else{
		   return  businessArea.toUpperCase();
		}
	   } 
   
	formatObj.statusText = function (ticketStatus) {
		var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
		switch (ticketStatus) {
			case "0":
				return resourceBundle.getText("ticketStatusOpen");
			case "1":
				return resourceBundle.getText("ticketStatusInProgress");
			case "2":
				return resourceBundle.getText("ticketStatusClosed");
			default:
				return ticketStatus;
		}
	}

	formatObj.urgencyText = function (ticketStatus) {
		var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
		switch (ticketStatus) {
			case "3":
				return resourceBundle.getText("ticketStatusHighUrgency");
			case "2":
				return resourceBundle.getText("ticketStatusMediumUrgency");
			case "1":
				return resourceBundle.getText("ticketStatusLowUrgency");
			default:
				return ticketStatus;
		}
	}
	formatObj.getCalenderWeek = function (){
		//set the prototype
		   Date.prototype.getWeek = function() {
				var onejan = new Date(this.getFullYear(), 0, 1);
				return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
			}
		
			const calenderWeek = (new Date()).getWeek();
			 return calenderWeek;
		}
	return formatObj;

});