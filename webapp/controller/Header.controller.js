sap.ui.require([
	"sap/ui/core/mvc/Controller",
	'sap/ui/Device',
	"sap/ui/core/UIComponent",
	"sap/ui/core/Fragment",
	"sap/base/Log",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/Sorter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/GroupHeaderListItem",
	"demo/ui5/TodModApp/controller/formatter"
], function (Controller, Device, UIComponent, Fragment, Log, JSONModel, MessageToast, Sorter, Filter, FilterOperator, GroupHeaderListItem,
	formatter) {
	"use strict";

	return Controller.extend("demo.ui5.TodModApp.controller.Header", {

		formatter: formatter,

		onInit: function () {
			console.log('INIT at Header Controller');
			const oGridListModList_ID = 'oGridListModList';
			const oGridListTodList_ID = 'oGridListTodList';
			const oGridListMimList_ID = 'oGridListMimList';
			const oIconTabBarMain_ID = 'oIconTabBarMain';
			const oObjectHeaderMain_ID = 'oObjectHeaderMain';

			this._oGridModListControl = this.byId(oGridListModList_ID);
			this._oGridTodListControl = this.byId(oGridListTodList_ID);
			this._oGridMimListControl = this.byId(oGridListMimList_ID);
			this._oIconTabBarControl = this.byId(oIconTabBarMain_ID);
			this._oObjectHeaderControl = this.byId(oObjectHeaderMain_ID);

			var parentControl = this.getOwnerComponent().getAggregation("rootControl");
			var parentController = parentControl.getController();

			if (parentController._devSettings.debugMode) {
				debugger;
				Log.info("-->HEADER Controller -onINIT() is called");

			}

			var bIsPhone = Device.system.phone;
			let sdcLogo = sap.ui.require.toUrl("demo/ui5/TodModApp/media/sdc_logo.jpg");

			let oPanelSearch = this.byId('oPanelSearch');
			if (oPanelSearch) {
				oPanelSearch.addStyleClass('myGoldenStyle');
			}

			//create Json model for the header panel
			let oDateModel = new JSONModel({
				sdcLogo: sdcLogo,
				imageWidth: bIsPhone ? "5em" : "15em",
				imageHeight: bIsPhone ? "2em" : "2em",
				dates: {
					currentDate: new Date(),
					currentCalenderWeek: this.formatter.getCalenderWeek()
				}

			});
			this._oObjectHeaderControl.setModel(oDateModel);

			//Promise to parse users based on either mod,tod,mim
			//get all the users-can be a promise!
			this._allUsers = this.getAllUsers();

			this._todsFiltered = this._allUsers.filter((obj) => obj.role == 'tod');
			this._modsFiltered = this._allUsers.filter((obj) => obj.role == 'mod');
			this._mimsFiltered = this._allUsers.filter((obj) => obj.role == 'mim');

			/*
			 //create a Model to be accessed by this object! 
			 const keyMods = 'mods';
			 const keyTods = 'tods';
			 const keyMims = 'mims';

			 this._gridTodListJSONModel = new JSONModel({
			     [keyTods]: this._todsFiltered
			 });
			 this._gridModListJSONModel = new JSONModel({
			     [keyMods]: this._modsFiltered
			 });
			 this._gridMimListJSONModel = new JSONModel({
			     [keyMims]: this._mimsFiltered
			 });
			 
			 this._oGridTodListControl.setModel(this._gridTodListJSONModel);
			 this._oGridModListControl.setModel(this._gridModListJSONModel);
			 this._oGridMimListControl.setModel(this._gridMimListJSONModel);
			*/

			//Create JsonModel for tods and set the data
			this.createModelForTodsModsMims('tods', this._oGridTodListControl)
				.then((jsonModel) => {
					jsonModel.setProperty('/tods', this._todsFiltered);
				})
				.catch((err) => {
					console.log(err.message);
					MessageToast.show(err.message);
				})
				.finally();

			//Create JsonModel for mods and set the data
			this.createModelForTodsModsMims('mods', this._oGridModListControl)
				.then((jsonModel) => {
					jsonModel.setProperty('/mods', this._modsFiltered);
				})
				.catch((err) => {
					console.log(err.message);
					MessageToast.show(err.message);
				})
				.finally();

			//Create JsonModel for Mims and set the data
			this.createModelForTodsModsMims('mims', this._oGridMimListControl)
				.then((jsonModel) => {
					jsonModel.setProperty('/mims', this._mimsFiltered);
				})
				.catch((err) => {
					console.log(err.message);
					MessageToast.show(err.message);
				})
				.finally();

		},
		onBeforeRendering: function () {
			console.log("Header  on BEFORE RENDERING is called");
		},

		onAfterRendering: function () {
			console.log("Header afterRendering is called");
			this.getView().getModel().getData().tods = this._todsFiltered;
			this.getView().getModel().getData().mods = this._modsFiltered;
			this.getView().getModel().getData().mims = this._mimsFiltered;

		},
		onSelectIconBar: function () {
			// var j = this.byId('oBtnPrimary');
			//j.addStyleClass('sapMBtnPhonePrimary');
			//$('.sapMBtnTransparent').addClass('sapMBtnPhonePrimary');
		},
		createModelForTodsModsMims: function (propertyName, gridList) {
			let promise = new Promise(function (resolve, reject) {
				//json model for mods
				let modelObj = {
					[propertyName]: []
				};
				/* creates dynamic type like :
                    let modListJsonModel = new JSONModel({
                    mods: []
                   });
                   //json model for tods
                  let todListJsonModel = new JSONModel({
                    tods: []
                 });
                    */
				let jsonModel = new JSONModel(modelObj);
				if (gridList) {
					gridList.setModel(jsonModel);
					resolve(jsonModel);
				} else {
					reject(new Error('Json Model creation failed'));
				}
			});
			return promise;
		},

		//All the data is in one place its at the App Controller and need to get it
		// We need to split data using Promise based approach
		getAllUsers: function () {
			var parentView = this.getAppView();
			var users = parentView.getModel().getData().users;
			if (!users)
				throw new Error('failed');

			return users;
		},
		getAppView: function () {
			var parentControl = this.getOwnerComponent().getAggregation("rootControl");
			var parentView = parentControl.getController().getView();
			return parentView;
		},
		onSelectTemplatesChange: function (oEvent) {
			debugger;
			let srcComboControl = oEvent.getSource();
			if (srcComboControl.getValueState() === sap.ui.core.ValueState.Error) {
				srcComboControl.setValueState(sap.ui.core.ValueState.Information);
			}

		},
		onSelectTemplatesFinish: function (oEvent) {
			let selectedTemplates = oEvent.getSource().getSelectedItems();
			let allSelectedTemplateKeys = selectedTemplates.map((obj) => obj.mProperties.key);

			let comboModulesControl = this.byId('oMultiComboModules');
			let all_modules = this.getView().getModel().getProperty('/modules');

			//if user selects template
			if (allSelectedTemplateKeys.length > 0) {
				//filter the matching modules based on the templates selected
				let matchingModules = all_modules.filter((item) => {
					if (allSelectedTemplateKeys.indexOf(item.templateID) !== -1)
						return true;
				});
				/*                        
				var oItemTemplate = new sap.ui.core.ListItem({text:"{name}"});
				var oComboBox = new sap.m.ComboBox({
				    items: {
				        path: "/modules", 
				        template: oItemTemplate
				    }
				});
				*/
				// comboModulesControl.getModel().setData(matchingModules);
				// comboModulesControl.getModel().refresh();
				comboModulesControl.getModel().setProperty('/modules', matchingModules);
			} else {
				comboModulesControl.getModel().setProperty('/modules', all_modules);
			}

		},
		// function to quick view opening
		openQuickView: function (oEvent, oModel) {
			var oButton = oEvent.getSource(),
				oView = this.getView();

			if (!this._pQuickView) {
				this._pQuickView = Fragment.load({
					id: oView.getId(),
					name: "demo.ui5.TodModApp.view.fragments.UserDetailDialog",
					controller: this
				}).then(function (oQuickView) {
					oView.addDependent(oQuickView);
					return oQuickView;
				});
			}
			this._pQuickView.then(function (oQuickView) {
				oQuickView.setModel(oModel);
				oQuickView.openBy(oButton);
			});
		},

		// function to handle product card press event
		onUserDetailPressed: function (oEvent) {
			var oView = this.getView(),
				oSelectedItem = oEvent.getSource(),
				sPath,
				oQuickViewModel = new JSONModel();

			const oContext = oSelectedItem.getBindingContext();

			sPath = oContext.getPath();
			
			//quick view model created
			oQuickViewModel.setData({
				"pages": [{
					"pageId": "employeePageId",
					"header": "User Details",
					"icon": "sap-icon://employee",
					"title": oContext.getProperty("firstName") + " " + oContext.getProperty("lastName"),
					"description": oContext.getProperty("templateName") + " " + oContext.getProperty("businessAreaName"),
					"groups": [{
						"heading": "Contact Details",
						"elements": [{
							"label": "Mobile",
							"value": oContext.getProperty("mobileNumber"),
							"elementType": "mobile"
						}, {
							"label": "Phone",
							"value": oContext.getProperty("backupMobileNumber"),
							"elementType": "phone"
						}, {
							"label": "Email",
							"value": oContext.getProperty("emailAddress"),
							"emailSubject": "Subject",
							"elementType": "email"
						}]
					}, {
						"heading": "Details",
						"elements": [{
							"label": "Manager",
							"value": oContext.getProperty("manager"),
							"elementType": "link"
						}]
					}]
				}]
			});

			this.openQuickView(oEvent, oQuickViewModel);

		},
		// function to handle close button press event (in product dialog)
		onCloseUserDetailDialog: function () {
			this.byId("userDetailDialog").close();
		},
		onSearchTodList: function (oEvent) {

			debugger;
			let comboTemplatesControl = this.byId('oMultiComboTemplates');
			let comboModulesControl = this.byId('oMultiComboModules');

			//make sure that the user selects both the template and the module

			let selectedTemplates = comboTemplatesControl.getSelectedItems();
			let selectedModules = comboModulesControl.getSelectedItems();

			if (!selectedTemplates.length) {
				//set the value state to Error
				comboTemplatesControl.setValueState(sap.ui.core.ValueState.Error);
				return MessageToast.show('Please select a valid template');
				//$(".sapMMessageToast").addClass("sapMMessageToastSuccess ");
			} else {
				//     comboTemplatesControl.setValueState(sap.ui.core.ValueState.Information);
			}
			let selectedTemplateKeys = selectedTemplates.map((item) => item.getKey());
			let selectedModuleKeys = selectedModules.map((item) => item.getKey());

			//get the binding
			let gridList = this.getView().byId('oGridListTodList');

			//enable to visible
			//gridList.getVisible() ==false ? gridList.setVisible(true):gridList.setVisible(true) ;

			let oListBinding = gridList.getBinding('items');

			let templateSearchFilter = [],
				moduleSearchFilter = [];

			// add new filter to array
			// filter on field 'Name', with 'contains' operation, for search value 'sQuery'
			if (selectedTemplateKeys.length) {
				for (let selectedKey of selectedTemplateKeys)
					templateSearchFilter.push(new Filter("templateID", FilterOperator.EQ, selectedKey));
			} else {
				templateSearchFilter.push(new Filter("templateID", FilterOperator.Contains, '-'));
			}

			if (selectedModuleKeys.length) {
				// add new filter to array
				// filter on field 'Name', with 'contains' operation, for search value 'sQuery'
				for (let selectedKey of selectedModuleKeys)
					moduleSearchFilter.push(new Filter("businessAreaID", FilterOperator.EQ, selectedKey));
			} else {
				moduleSearchFilter.push(new Filter("businessAreaID", FilterOperator.Contains, '-'));
			}
			//template search filter
			console.log(...templateSearchFilter);
			//module search filter
			console.log(...moduleSearchFilter);

			// apply filters to gridlist binding items
			const finalFilter = new Filter({
				and: true,
				filters: [
					new Filter({
						filters: templateSearchFilter,
						and: false
					}),
					new Filter({
						filters: moduleSearchFilter,
						and: false
					})
				]
			});
			var result = oListBinding.filter(finalFilter);

		},
		getAllUsersPromise: function () {
			var parentControl = this.getOwnerComponent().getAggregation("rootControl");
			let mypromise = new Promise(function (resolve, reject) {
				var parentView = parentControl.getController().getView();
				var users = parentView.getModel().getData().users;
				if (users) {
					resolve(users);
				} else {
					reject(new Error('Failed to read the user data'));
				}
			});
			return mypromise;
		},
		getGroupHeader: function (oGroup) {
			return new GroupHeaderListItem({
				title: oGroup.key,
				upperCase: true,
			});

		},
		onCreateTicket: function (oEvent) {
			console.log('Creating a new ticket');
			var oView = this.getView();
			// create dialog lazily if can't find the dialog by it's id
			if (!this.byId("createTicketDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "demo.ui5.TodModApp.view.fragments.CreateTicketDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				// open dialog
				this.byId("createTicketDialog").open();
			}
		},
		onSubmitNewTicket: function () {
			var oinputTicketRef = this.byId("inputTicketRef").getValue(),
				oinputTemplate = this.byId("inputTemplate").getValue(),
				oinputStatus = this.byId("inputStatus").getValue(),
				oinputAssignedTo = this.byId("inputAssignedTo").getValue(),
				oinputDetails = this.byId("inputDetails").getValue();

			var oNewTicketObj = {};

			oNewTicketObj.cism_ticket_ref = oinputTicketRef;
			oNewTicketObj.template = oinputTemplate;
			oNewTicketObj.status = oinputStatus;
			oNewTicketObj.assignedTo = oinputAssignedTo;
			oNewTicketObj.details = oinputDetails;

			console.log(oNewTicketObj);

			let oModel = this.getView().getModel();

			var oData = JSON.stringify(oNewTicketObj);
			var sLocalPath = './model/tickets.json';

			jQuery.ajax({
				type: "POST",
				contentType: "application/json",
				data: oData,
				url: sLocalPath,
				dataType: "json",
				success: function () {
					console.log('Success');
					// that._updateModel(sLocalPath, oObject); 
					// that.createEntry("/");
					// that.fireRequestCompleted();
				},
				error: function () {
					console.log('Failed');

					// that.fireRequestFailed();
				}
			});

			/*                 oModel.create("/tickets", oNewTicketObj, {
			                    success: function (res) {
			                        MessageToast.show("New product created");
			                    },
			                    error: function (err) {
			                        MessageToast.show("Failed to create new product");
			                    }
			                }); */

			this.byId("createTicketDialog").close();

		},
		// close create product dialog
		onCancelCreateTicket: function () {
			this.byId("createTicketDialog").close();
		},
		onSortByFirstName: function (oEvent) {
			console.log('Sort button is pressed');
			let eventObj = oEvent.getSource();
			console.dir(eventObj);

			//get the view
			let view = this.getView();
			let gridList = view.byId("todList");
			if (!gridList) {
				console.log('could not find the control');
			}
			if (gridList) {
				let bindings = gridList.getBinding("items");
				console.log(bindings);
				bindings.sort(new Sorter("firstName"));
			}
		},
		onSearchTicketByIDORTemplate: function (oEvent) {
			let sQuery = oEvent.getParameter("query");
			//get the binding
			let gridList = this.getView().byId('ticketList');

			let oListBinding = gridList.getBinding('items');
			let searchFilter = [];
			if (sQuery) {
				//searchFilter.push(new Filter(criteria, FilterOperator.Contains, sQuery));
				searchFilter.push(new Filter("template", FilterOperator.Contains, sQuery));
				searchFilter.push(new Filter("cism_ticket_ref", FilterOperator.Contains, sQuery));
			}
			debugger;

			// apply filters to gridlist binding items
			var result = oListBinding.filter(new Filter({
				filters: searchFilter,
				and: false
			}));

		},
		addToFilter: function (criteria, sQuery, anyFilter) {
			anyFilter.push(new Filter(criteria, FilterOperator.Contains, sQuery));
			return anyFilter;
		},
		onButtonPressed: function () {
			//Need to go to the next view!
			var oRouter = UIComponent.getRouterFor(this);

			console.log(oRouter);
			//get the MessageToast
			let toast = sap.ui.require("sap/m/MessageToast");
			console.log(toast);
			// use route name 'detail' here
			//oRouter.navTo("detail");

			oRouter.navTo("to_detail", {
					// only parameters defined in "pattern" in manifest.json will be passed to target
					productId: 'hello world'
				},
				true);

		},
		onTicketListPress: function (oEvent) {
			//here goes the code!
			let list = oEvent.getSource();
			console.log(`The type of the event source is ${list.getMetadata().getName()}`);
			debugger;

		},
		onTriggerPhoneCall: function (oEvent) {
			debugger;
			//get the button binding context
			let currentContext = oEvent.getSource().getBindingContext().getObject();
			if (currentContext)
				sap.m.URLHelper.triggerTel(currentContext.mobileNumber);
		}

	});
});