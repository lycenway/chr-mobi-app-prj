define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind'
], function (Backbone, $, App, Tpl) {
	return Backbone.View.extend({
		el: App.$tab,

		events: {
			'tap li': 'select'
		},

		initialize: function (options) {
			this.type = options.type
			this.listenTo(this.collection, 'all', this.render)
		},

		render: function () {
			var self = this

			Tpl.bind(
				'common/tab',
				{ tabs: this.collection.toJSON() },
				function (html) {
					self.$el.html(html)
				}
			)
		},

		select: function (e) {
			var type = $.trim(e.currentTarget.className.replace(/(\s*w-\d)|(w-\d\s*)/gi, ''))
			var selectedTab = this.collection.where({ type: type })

			if (!selectedTab.length) {
				return
			}

			selectedTab = selectedTab[0]
			
			_.each(this.collection.models, function (item) {
				item.set('active', false)
			})

			selectedTab.set('active', true)

			var url

			if (this.type === 'indexs') {
				url = selectedTab.get('type') + 's/rejected'
			} else {
				url = this.type + '/' + selectedTab.get('type')
			}

			url = '/' + url
			
			App.router.navigate(url, { trigger: true })
			
		}
	})
})