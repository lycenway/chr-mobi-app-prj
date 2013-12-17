define(['backbone'], function (Backbone) {
	return Backbone.Model.extend({
		url: function () {
			return '/contract/' + this.get('id')
		},

		idAttribute: '_id',

		defaults: function() {
			return {
				id: '',
				serialNumber: '',
				registerName: '',
				contractType: '',
				contractNumber: '',
				approvalStatus: '',
				accountName: '',
				approverName: '',
				approverTitle: '',
				approverMemo: '',
				contacts: []
			}
	    }
	})
})