define([
	'backbone',
	'app',
	'../../tpl-data-bind',
	'app/../../component/date'
], function(Backbone, App, Tpl, DateUtil) {
	return Backbone.View.extend({
		el: $(document.body),

		events: {
			'tap .select-date-picker .add': 'add',
			'tap .select-date-picker .minus': 'minus',
			'tap .select-date-ok': 'submit'
		},

		render: function() {
			var self = this

			this.convertToDateTime(this.model.toViewJSON().visitDate)

			Tpl.bind(
				'visit/create-select-date', {
					date: this.visitDate
				},
				function(html) {
					var $html = $(html)

					if (!self.$container) {
						self.$container = $html.appendTo(self.$el)
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

		convertToDateTime: function(stringDate) {
			try {
				this.visitDate = new Date(stringDate)
			} catch (e) {
				this.visitDate = new Date()
			}
		},

		add: function(e) {
			
			if ($(e.currentTarget).parent().hasClass('select-date-year')) {			
				
					this.visitDate.setFullYear(this.visitDate.getFullYear() + 1)
				
			}
			if ($(e.currentTarget).parent().hasClass('select-date-month')) {
				
					this.visitDate.setMonth(this.visitDate.getMonth() + 1)
				
				
			}
			if ($(e.currentTarget).parent().hasClass('select-date-day')) {
				
					this.visitDate.setDate(this.visitDate.getDate() + 1)
				
			}
			this.reloadDate()
			return false
		},

		minus: function(e) {
			if ($(e.currentTarget).parent().hasClass('select-date-year')) {
				this.visitDate.setFullYear(this.visitDate.getFullYear() - 1)
			}
			if ($(e.currentTarget).parent().hasClass('select-date-month')) {
				this.visitDate.setMonth(this.visitDate.getMonth() - 1)
			}
			if ($(e.currentTarget).parent().hasClass('select-date-day')) {
				this.visitDate.setDate(this.visitDate.getDate() - 1)
			}
			this.reloadDate()
			return false
		},

		reloadDate: function() {
			$('.select-date-year .visit-data').html(this.visitDate.getFullYear() + '年')
			$('.select-date-month .visit-data').html((this.visitDate.getMonth() + 1) + '月')
			$('.select-date-day .visit-data').html(this.visitDate.getDate() + '日')	
			
			if(DateUtil.formateStdString(this.visitDate)<=DateUtil.formateStdString(new Date()))
			{
				this.disabledSelectDateOkBtn(false)
			}
			else
			{
				this.disabledSelectDateOkBtn(true)
			}
			
			

		},

		submit: function(e) {
			if(DateUtil.formateStdString(this.visitDate)<=DateUtil.formateStdString(new Date()))
			{
				this.model.set('visitDate', DateUtil.formateStdString(this.visitDate))
				var self = this
				self.hide()
			}			
		},

		setSize: function() {
			var height = this.$container.height()
			var wHeight = $(window).height()

			this.$container.css({
				'top': (wHeight - height) / 2
			})
		},

		show: function() {
			var self = this
			App.maskView.show(function() {
				self.hide()
			})
			this.setSize()
		},

		hide: function() {
			this.$container.remove()
			App.maskView.hide()
		},

		disabledSelectDateOkBtn: function(flag)
		{
			this.$el.find('.select-date-ok')[flag ? 'addClass' : 'removeClass']('disable-select-date-ok')
		}

	})
})