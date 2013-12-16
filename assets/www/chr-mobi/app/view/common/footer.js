define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind'
], function (Backbone, $, App, Tpl) {
	return Backbone.View.extend({
		el: App.$footer,

		events: {
			'tap': 'select'
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render)
		},

		render: function () {
			var self = this

			Tpl.bind(
				'common/footer',
				this.model.toJSON(),
				function (html) {
					self.$el.html(html)
				}
			)

			return this
		},

		select: function (e) {
			var liEls = this.$el.find('li')

			if (e.target.nodeName.toLowerCase() === 'li') {
				currentLiEl = e.target
			} else {
				currentLiEl = $(e.target).parent('li')
			}

			_.each(liEls, function (el) {
				$(el).removeClass('active')
			})

			$(currentLiEl).addClass('active')
		}
	})
})