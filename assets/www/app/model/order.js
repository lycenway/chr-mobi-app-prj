define(['backbone'], function (Backbone) {
	return Backbone.Model.extend({
		url: function () {
			return '/dealGroup/' + this.get('id')
		},

		idAttribute: '_id',

		defaults: function() {
			return {
				serialNumber: '',
			    productURL: '',
			    productTitle: '',
			    productNumber: '',
			    productionStatus: '',
			    productDescription: '',
			    onlineStatus: '',
			    mainDealName: '',
			    k2InstId: '',
			    id: '',
			    dealNumber: '',
			    contacts: [],
				amountMonth: 0,
				amountAll: 0,
				commissionMonth: 0,
				commissionAll: 0,
				receiptAll: 0,
				receiptMonth: 0,
				visit: 0
			}
	    }
	})
})