define(function (require) {
	var Backbone = require('backbone'),
		Tab = require('model/tab')

	return Backbone.Collection.extend({
		model: Tab,

		resetActive: function () {
			var model = this.getItem({ active: true })

			if (model) {
				model.set('active', false)
			}
		},

		active: function (type) {
			if (!type) {
				return
			}
			var model = this.getItem({ type: type })

			if (!model) {
				return
			}

			this.resetActive()

			model.set('active', true)
		},

		getItem: function (attr) {
			return this.where(attr)[0]
		}
	})
})