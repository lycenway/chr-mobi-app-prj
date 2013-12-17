define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind',
	'../../../component/number'
], function(Backbone, $, App, Tpl, numUtil) {
	return Backbone.View.extend({
		tagName: 'ul',

		className: 'detail-list',

		events: {
			'tap .call-shop': 'showContacts',
			'tap .online-order h3': 'toggleDetail'
		},

		initialize: function() {
			this.hash = Backbone.history.getHash()

			this.listenTo(this.collection, 'sync', this.render)

			this.$pullDown = $('<div class="pull-down"></div>')
			this.$pullDownLabel = this.$pullDown.find('.pull-down-label')
			this.bindRefresh()

			if (this.collection.type === 'online') {
				this.limit = 6
				this.offset = 0

				this.$pullUp = $('<div class="pull-up"><span class="pull-up-ico"></span><span class="pull-up-label">向上拉加载更多...</span></div>')
				this.$pullLabel = this.$pullUp.find('.pull-up-label')

				this.bindSwipe()
			}
		},

		render: function() {
			if (this.hash !== Backbone.history.getHash()) return this

			var self = this

			if (this.collection.type === 'online') {
				return this.renderOnline()
			}

			Tpl.bind(
				'order/list-' + this.collection.type, {
					'orders': this.collection.toJSON()
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
					self.offset = 0

					if (self.collection.type === 'online') {
						self.collection.fetch({
							_server: ENV.apiServers.crm,

							data: {
								limit: self.limit,
								offset: 0
							},

							_cache: {
								key: '/orders/' + self.collection.type,
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
					} else {
						self.collection.fetch({
							_cache: {
								key: '/orders/' + self.collection.type,
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


				}
			})

		},

		bindSwipe: function() {
			var self = this

			this.$el.on('swipeUp', function() {
				if (self.isPulling) {
					return
				}

				if (App.iscroll.y < App.iscroll.maxScrollY - 5) {
					self.isPulling = true

					self.$pullLabel.text('加载中...')

					self.collection.fetch({
						_server: ENV.apiServers.crm,

						data: {
							limit: self.limit,
							offset: self.offset
						},
						success: function() {
							self.isPulling = false
							self.$pullLabel.text('向上拉加载更多...')
						},
						error: function() {
							self.isPulling = false
							self.$pullLabel.text('向上拉加载更多...')
						}
					})
				}
			})
		},

		renderOnline: function() {
			var self = this

			var orders = this.collection.toJSON()

			if (!orders.length) {
				alert('没有更多订单了！')
				return
			}

			orders.forEach(function(item) {
				item.amountMonth = numUtil.formatMoney(item.amountMonth)
				item.amountAll = numUtil.formatMoney(item.amountAll)
				item.commissionMonth = numUtil.formatMoney(item.commissionMonth)
				item.commissionAll = numUtil.formatMoney(item.commissionAll)
			})

			Tpl.bind(
				'order/list-' + this.collection.type, {
					'orders': orders
				},
				function(html) {
					if (self.offset === 0) {
						self.$el.html(html)
						App.$module.html(self.$el)
						self.$el.after(self.$pullUp)
						self.$el.before(self.$pullDown)
					} else {
						self.$el.append(html)
					}

					self.offset += self.collection.length
				}
			)
			return this
		},

		showContacts: function(e) {
			var index = parseInt($.trim($(e.currentTarget).attr('item-index')), 10)

			var selectedItem = this.collection.at(index)

			App.contacts.reset(selectedItem.get('contacts'))

			return false
		},

		toggleDetail: function(e) {
			var $detail = $(e.currentTarget).parent().find('.product-detail')
			$detail.toggle()

			var $arrow = $(e.currentTarget).find('.arrow')
			var status = $arrow.attr('data-status')
			var deg

			if (status === 'open') {
				status = ''
				deg = 'rotate(225deg)'
			} else {
				status = 'open'
				deg = 'rotate(45deg)'
			}

			$arrow.attr('data-status', status)
			$arrow[0].style.webkitTransform = deg

			//gaPlugin.sendEvent(null, null, 'user', 'click', 'deal-online-detail-' + (status ? status : 'close'), 0)

			return false
		}
	})
})