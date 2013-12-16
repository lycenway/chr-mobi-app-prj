define([
	'backbone',
	'model/nav'
], function (Backbone, Nav) {
	return Backbone.Collection.extend({
		model: Nav,

		initialize: function (options) {
			if (options && options.type) {
				this.type = options.type
			}
		}
	})
})