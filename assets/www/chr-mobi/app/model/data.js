define([
	'backbone'
], function (Backbone) {
	return Backbone.Model.extend({
		url: function () {
			return '/SalesPerformance/Summary'
		},

		defaults: function() {
			return {
				"contract": {
					"rejected": '0',
					"inApproval": '0',
					"approved": '0'
				},
				"dealGroup": {
					"rejected": '0',
					"online": '0',
					"inProduction": '0'
				},
				"performance": {
					"teamAmount": 0,
					"salesAmount": 0,
					"salesIncome": 0,
					"onlineDealGroup": 0,
					"onlineKABAccount": 0,
					"newDealGroup": 0
				}
			}
	    }
	})
})
