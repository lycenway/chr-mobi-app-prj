define(['backbone', 'model/order'], function (Backbone, Order) {
	return Backbone.Collection.extend({
		model: Order,

		url: function () {
			if (this.type === 'online') {
				return '/SalesPerformance/List'
			}

			return '/dealGroups/' + this.type
		},

		initialize: function (options) {
			if (options && options.type) {
				this.type = options.type
			}
		}
	})
})