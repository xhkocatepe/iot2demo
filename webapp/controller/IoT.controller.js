/*eslint-disable*/
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel"
], function(Controller, ODataModel, Sorter, JSONModel) {
	"use strict";

	return Controller.extend("IoT_Demo.controller.IoT", {
		onInit: function(oEvent) {
			//Create Models
			var that = this;
			var mmsModel = new ODataModel("/iotmms/v1/api/http/app.svc/");
			mmsModel.setUseBatch(false);
			mmsModel.setSizeLimit(10);
			var oSort = new Sorter("G_CREATED", true);

			//Temperature 
			mmsModel.read("/SYSTEM.T_IOT_7120BC27EA5B5DE7B62E", {
				sorters: [oSort],
				success: function(resp) {
					var items = resp.results.slice(0, 10);
					var lineChartData = {
						labels: [items[9].G_CREATED, items[8].G_CREATED, items[7].G_CREATED, items[6].G_CREATED, items[5].G_CREATED,
							items[4].G_CREATED, items[3].G_CREATED,
							items[2].G_CREATED,
							items[1].G_CREATED,
							items[0].G_CREATED
						],
						datasets: [{
							label: items[0].G_DEVICE,
							fill: false,
							lineTension: 0.1,
							backgroundColor: "rgba(75,192,192,0.4)",
							borderColor: "rgba(75,192,192,1)",
							borderCapStyle: 'butt',
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointBorderColor: "rgba(75,192,192,1)",
							pointBackgroundColor: "#fff",
							pointBorderWidth: 1,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: "rgba(75,192,192,1)",
							pointHoverBorderColor: "rgba(220,220,220,1)",
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10,
							data: [items[9].C_TEMPERATURE, items[8].C_TEMPERATURE, items[7].C_TEMPERATURE, items[6].C_TEMPERATURE, items[5].C_TEMPERATURE,
								items[4].C_TEMPERATURE, items[3].C_TEMPERATURE,
								items[2].C_TEMPERATURE,
								items[1].C_TEMPERATURE,
								items[0].C_TEMPERATURE
							],
							spanGaps: false
						}, {
							label: items[0].G_DEVICE,
							fill: false,
							lineTension: 0.1,
							backgroundColor: "rgba(75,192,192,0.4)",
							borderColor: "orange",
							borderCapStyle: 'butt',
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointBorderColor: "rgba(75,192,192,1)",
							pointBackgroundColor: "#fff",
							pointBorderWidth: 1,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: "rgba(75,192,192,1)",
							pointHoverBorderColor: "rgba(220,220,220,1)",
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10,
							data: [items[9].C_HUMIDITY, items[8].C_HUMIDITY, items[7].C_HUMIDITY, items[6].C_HUMIDITY, items[5].C_HUMIDITY,
								items[4].C_HUMIDITY, items[3].C_HUMIDITY,
								items[2].C_HUMIDITY,
								items[1].C_HUMIDITY,
								items[0].C_HUMIDITY
							],
							spanGaps: false
						}]
					};
					that.getView().setModel(new JSONModel({
						lineChart: lineChartData
					}), "temp");
				},
				error: function(error) {
					debugger;
				}
			});
			//Blink
			mmsModel.read("/SYSTEM.T_IOT_C549C85DEB7D280490E1", {
				sorters: [oSort],
				success: function(resp) {

					var aLED0 = resp.results.reduce(function(r, a) {
						r[a.C_LED0] = r[a.C_LED0] || [];
						r[a.C_LED0].push(a);
						return r;
					}, Object.create(null));
					var aLED1 = resp.results.reduce(function(r, a) {
						r[a.C_LED1] = r[a.C_LED1] || [];
						r[a.C_LED1].push(a);
						return r;
					}, Object.create(null));

					var pieChartData = {
						labels: [
							"LED0",
							"LED1"
						],
						datasets: [{
							data: [aLED0.true.length, aLED1.true.length],
							backgroundColor: [
								"#FFCE56",
								"#36A2EB"
							],
							hoverBackgroundColor: [
								"#FFCE56",
								"#36A2EB"
							]
						}],
						borderWidth : [500]
					};
					that.getView().getModel("temp").setProperty("/pieChart", pieChartData)
				},
				error: function(error) {
					debugger;
				}
			});
		}
	});
});