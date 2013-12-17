define([
	'backbone',
	'app',
	'../../tpl-data-bind'
], function(Backbone, App, Tpl) {
	return Backbone.View.extend({
		className: 'title-back-container',

		events: {
			'tap .back-pointer': 'back',
			'tap .save-btn': 'save'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render)
		},

		render: function() {
			var self = this

			Tpl.bind(
				'header/title-with-back',
				this.model.toJSON(),
				function(html) {
					self.$el.html(html)
					App.$header.html(self.$el)

					self.$saveBtn = self.$el.find('.save-btn')
				}
			)
		},

		back: function() {
			if (this.delegatedBack) {
				this.delegatedBack()
			}
			window.history.back()
		},

		save: function() {
			if (this.delegatedSave) {
				this.delegatedSave()
			}
		},

		disableSaveBtn: function (flag) {
			this.model.set({ isSaveBtnDisabled: flag })
		}
	})
})