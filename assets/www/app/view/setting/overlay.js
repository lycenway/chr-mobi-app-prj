define([
	'backbone',
	'app',
	'../../tpl-data-bind',
	'../common/mask'
], function (Backbone, App, Tpl) {
	return Backbone.View.extend({
		el: $(document.body),

		events: {
			'submit .quota-form': 'submit',
			'tap .cancle': 'hide'
		},

		initialize: function () {
			this.model.on('invalid', this.invalid)
		},

		render: function () {
			var self = this

			Tpl.bind(
				'setting/overlay',
				this.model.toJSON(),
				function (html) {
					var $html = $(html)

					if (!self.$container) {
						self.$container = $html.appendTo(self.$el)
						self.$input = self.$container.find('.quota-input')
						self.show()
						return
					}

					self.$container.replaceWith($html)
					self.$container = $html
					self.show()
				}
			)

			return this
		},

		submit: function (e) {
			var quota = this.$input.val()

			this.model.set({ quota: quota }, { validate: true })
			
			if (this.model.get('quota') === quota) {
				this.hide()
			}

			return false
		},

		invalid: function (model, error) {
			alert(error)
		},

		setSize: function () {
			var height = this.$container.height()
			var wHeight = $(window).height()

			this.$container.css({
				'top': (wHeight - height) / 2
			})
		},

		show: function () {
			App.maskView.show()
			this.setSize()
			this.$container.show()
			this.$input.focus()

			$(window).on('resize', _.bind(this.setSize, this))
		},

		hide: function () {
			this.$container.remove()
			App.maskView.hide()

			this.model.off('invalid', this.invalid)
			this.undelegateEvents()
			$(window).off('resize')
		}
	})
})