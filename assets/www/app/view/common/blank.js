define([
	'backbone',
	'app',
	'../../tpl-data-bind'
], function (Backbone, App, Tpl) {
	return Backbone.View.extend({
		el: App.$module,

		render: function (expr) {
			var self = this

			Tpl.bind(
				'common/blank', 
				null,
				function (html) {
					self.$el.html(html)
					if ( expr != undefined )
						self.$el.find('.blank').get(0).innerHTML = expr
				}
			)

			return this
		}
	})
})
