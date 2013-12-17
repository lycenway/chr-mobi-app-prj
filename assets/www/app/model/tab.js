define(function (require) {
	var Backbone = require('backbone')

	return Backbone.Model.extend({
		defaults: function () {
			return {
				type: '',
				num: '',
				active: false,
				text: ''
			}
		},

		active: function (flag) {
			this.set({ active: flag })
		}
	})
})