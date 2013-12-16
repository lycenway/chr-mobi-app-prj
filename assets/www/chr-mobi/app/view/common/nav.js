define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind'
], function (Backbone, $, App, Tpl) {
	return Backbone.View.extend({
		el: App.$header,

		events: {
			'tap li': 'select'
		},

		initialize: function (options) {
			this.listenTo(this.collection, 'all', this.render)
		},

		render: function () {
			var self = this

			Tpl.bind(
				'common/header',
				{ navs: this.collection.toJSON() },
				function (html) {
					self.$el.html(html)
				}
			)
		},

		select: function (e) {
			this.selectItemByType($.trim(e.currentTarget.className))
		},

		selectItemByType: function (type) {
			var selectedTab = this.collection.where({ type: type })

			if (!selectedTab.length) {
				return
			}

			selectedTab = selectedTab[0]

			_.each(this.collection.models, function (item) {
				item.set('active', false)
			})

			selectedTab.set('active', true)
		}
	})
})