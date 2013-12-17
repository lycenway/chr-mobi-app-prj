define([
	'backbone',
	'underscore',
	'app',
	'../../tpl-data-bind',
	'../../../component/number'
], function(Backbone, _, App, Tpl, numUtil) {
	return Backbone.View.extend({
		tagName: 'div',

		className: 'histogram',

		initialize: function() {
			this.hash = Backbone.history.getHash()
			this.listenTo(this.model, 'change', this.render)

			this.bindRefresh()
		},

		bindRefresh: function() {
			var self = this

			this.$el.on('swipeDown', function() {
				self.$pullDown = App.$module.find('.pull-down')

				if (self.isRefresh) {
					return
				}

				if (App.iscroll.y > 8) {
					self.$pullDown.addClass('pull-down-loading')
					self.isRefresh = true

					self.model.fetch({
						_server: ENV.apiServers.crm,
						_cache: {
							key: '/index',
							expiration: 0
						},
						background: true,
						success: function() {
							self.isRefresh = false
							self.$pullDown.removeClass('pull-down-loading')
						},
						error: function() {
							self.isRefresh = false
							self.$pullDown.removeClass('pull-down-loading')
							alert('加载失败，请重试。')
						}
					})
				}
			})
		},

		render: function() {
			if (this.hash !== Backbone.history.getHash()) return this
			var self = this

			var data = this.model.toJSON()

			self.$el.appendTo(App.$module)

			data.count.salesIncome = numUtil.formatMoney(data.count.salesIncome)

			Tpl.bind(
				'index/histogram',
				this.model.toJSON(),
				function(html) {
					self.$el.html(html)
					self.renderPercent(data.percentage)
				}
			)

			return this
		},

		renderPercent: function(percentage) {
			var self = this

			_.each(percentage, function(val, key) {
				var $target = self.$el.find('.' + key)

				if (val > 100) {
					$target.css({
						width: (val % 100) + '%'
					})

					$target.parents('dd').addClass('overflow')
					return
				}

				$target.css({
					'width': val + '%'
				})

			})
		}
	})
})