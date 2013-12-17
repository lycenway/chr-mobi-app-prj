define(['backbone', 'model/contract'], function (Backbone, Contract) {
	return Backbone.Collection.extend({
		model: Contract,

		url: function () {
			return '/contracts/' + this.type
		},

		initialize: function (options) {
			if (options && options.type) {
				this.type = options.type
			}
		}
	})
})