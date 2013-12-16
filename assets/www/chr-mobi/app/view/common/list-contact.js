define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind',
	'../../ga'
], function(Backbone, $, App, Tpl, gaPlugin) {
	return Backbone.View.extend({
		el: $(document.body),

		events: {
			'tap .contact-container .close': 'hide'
		},

		initialize: function() {
			this.listenTo(this.collection, 'reset', this.render)
		},

		render: function() {
			var self = this

			Tpl.bind(
				'common/list-contact', {
					contacts: this.collection.toJSON()
				},
				function(html) {
					var $html = $(html)

					if (!self.$container) {
						self.$container = $html.appendTo(self.$el)
						self.$scroller = self.$container.find('.contact-scroller')
						self.show()
						return
					}

					self.$container.replaceWith($html)
					self.$container = $html
					self.$scroller = self.$container.find('.contact-scroller')
					self.show()
				}
			)

			return this
		},

		setSize: function() {
			var height = this.$scroller.height() + this.$scroller.scrollTop() + 40
			var wHeight = $(window).height()

			this.$container.css({
				'top': (wHeight - height) / 2 - 20,
				'height': height
			})
		},

		scroll: function() {
			if (!this.$container) {
				return
			}

			new iScroll(this.$container.find('.contact-scroller')[0], {
				useTransform: true,

				onBeforeScrollStart: function(e) {
					var target = e.target

					while (target.nodeType != 1) {
						target = target.parentNode
					}

					if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
						e.preventDefault()
					}
				},

				checkDOMChanges: true
			})
		},

		show: function() {
			gaPlugin.sendEvent(null, null, 'user', 'click', 'call-contact', 0)
			var self = this
			App.maskView.show(function() {
				self.hide()
			})

			this.$container.show()
			this.scroll()

			this.setSize()

			$(window).on('resize', _.bind(this.setSize, this))
		},

		hide: function() {
			App.maskView.hide()
			this.$container.hide()

			$(window).off('resize')
		}
	})
})