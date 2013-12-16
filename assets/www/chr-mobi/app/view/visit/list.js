define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind',
	'../../../component/number',
	'../../../component/date',
	'../../ga'
], function(Backbone, $, App, Tpl, numUtil, dateUtil, gaPlugin) {
	return Backbone.View.extend({
		initialize: function() {
			this.hash = Backbone.history.getHash()
			this.listenTo(this.collection, 'sync', this.render)

			this.$pullDown = $('<div class="pull-down"></div>')
			this.swipeDown()

			this.offset = 0
			this.limit = 6
			this.$pullUp = $('<div class="pull-up"<span class="pull-up-ico"></span><span class="pull-up-label">向上拉加载更多...</span></div>')
			this.$pullUpLabel = this.$pullUp.find('.pull-up-label')
			this.swipeUp()
		},

		render: function() {
			if (this.hash !== Backbone.history.getHash()) return this

			var self = this

			var data = this.collection.toViewJSON()
			if (data[0].visitList.length > 0) {
				this.$pullUpLabel.text('向上拉加载更多...')
			} else {
				this.$pullUpLabel.text('')
			}
			data[0].today = dateUtil.formatDate(new Date())
			Tpl.bind(
				'visit/list', {
					'visits': data
				},
				function(html) {
					self.$el.html(html)
					App.$module.html(self.$el)
					self.$el.before(self.$pullDown)
					self.$el.after(self.$pullUp)
					self.limit += self.collection.length
				}
			)

			return this
		},

		swipeDown: function() {
			var self = this

			this.$el.on('swipeDown', function() {
				self.doSwipeDown(self, false)
			})
		},

		triggerSwipeDown: function() {
			this.doSwipeDown(this, true)
		},

		doSwipeDown: function(self, force) {
			if (self.isRefresh) {
				return
			}

			if (force || App.iscroll.y > 8) {
				self.$pullDown.addClass('pull-down-loading')
				self.isRefresh = true

				self.limit = 6

				self.collection.fetch({
					data: {
						limit: self.limit,
						offset: self.offset
					},
					_cache: {
						key: '/visits',
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
		},

		swipeUp: function() {
			var self = this

			this.$el.on('swipeUp', function() {
				if (self.isPulling) {
					return
				}

				if (App.iscroll.y < App.iscroll.maxScrollY - 5) {
					self.isPulling = true
					self.$pullUpLabel.text('加载中...')

					self.collection.fetch({
						data: {
							limit: self.limit,
							offset: self.offset
						},
						success: function() {
							self.isPulling = false
						},
						error: function() {
							self.isPulling = false
							console.log('swipeUp fetch errror')
						},
						background: true
					})
				}
			})
		}
	})
})