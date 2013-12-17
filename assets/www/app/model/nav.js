define(function (require) {
	var Backbone = require('backbone')

	return Backbone.Model.extend({
		defaults: function () {
			return {
				type: '',
				active: false,
				text: '',
				url: ''
			}
		}
	})
})