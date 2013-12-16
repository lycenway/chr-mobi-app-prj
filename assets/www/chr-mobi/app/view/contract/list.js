define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind'
], function(Backbone, $, App, Tpl) {
	return Backbone.View.extend({
		tagName: 'ul',

		className: 'detail-list',

		events: {
			'tap .call-shop': 'showContacts'
		},

		initialize: function() {
			this.listenTo(this.collection, 'sync', this.render)
			this.hash = Backbone.history.getHash()

			this.$pullDown = $('<div class="pull-down"></div>')
			this.$pullDownLabel = this.$pullDown.find('.pull-down-label')
			this.bindRefresh()
		},

		render: function() {
			if (this.hash !== Backbone.history.getHash()) return this

			var self = this

			Tpl.bind(
				'contract/list-' + this.collection.type, {
					'contracts': this.collection.toJSON()
				},
				function(html) {
					self.$el.html(html)
					App.$module.html(self.$el)
					self.$el.before(self.$pullDown)
				}
			)

			return this
		},

		bindRefresh: function() {
			var self = this

			this.$el.on('swipeDown', function() {
				if (self.isRefresh) {
					return
				}

				if (App.iscroll.y > 8) {
					self.$pullDown.addClass('pull-down-loading')
					self.isRefresh = true

					self.collection.fetch({
						_cache: {
							key: '/contracts/' + self.collection.type,
							expiration: 0
						},
						success: function() {
							self.isRefresh = false
							self.$pullDown.removeClass('pull-down-loading')
						},
						error: function() {
							self.isRefresh = false
							self.$pullDown.removeClass('pull-down-loading')
							alert('加载失败，请重试。')
						},
						background: true
					})
				}
			})

		},

		showContacts: function(e) {
			var index = parseInt($.trim($(e.currentTarget).attr('item-index')), 10)

			var selectedItem = this.collection.at(index)

			App.contacts.reset(selectedItem.get('contacts'))

			return false
		}
	})
})