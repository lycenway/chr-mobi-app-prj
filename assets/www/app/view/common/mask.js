define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind'
], function(Backbone, $, App, Tpl) {
	return Backbone.View.extend({
		el: $(document.body),

		events: {
			'tap .mask': 'tapHide'
		},

		initialize: function() {
			var self = this

			Tpl.bind(
				'common/mask', {},
				function(html) {
					var $html = self.$html = $(html)

					$html.hide()

					self.$el.append($html)
				}
			)
		},

		tapHide: function() {
			if (this.onTap) {
				this.onTap()
			}
		},

		show: function(onTap) {
			this.$html.show()
			this.onTap = onTap
		},

		hide: function() {
			this.$html.hide()
		}
	})
})