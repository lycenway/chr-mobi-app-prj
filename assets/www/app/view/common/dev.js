define(['backbone', 'app'], function (Backbone, App) {
	return Backbone.View.extend({
		className: 'deving',

		render: function () {
			var self = this

			App.bind(
				'common/dev',
				null,
				function (html) {
					self.$el.html(html)
					App.$module.html(self.$el)
				}
			)

			return this
		}
	})
})