define([
	'backbone',
	'app',
	'../../tpl-data-bind',
	'../../../component/autoSave'
], function (Backbone, App, Tpl, LocalCache) {
	return Backbone.View.extend({
		events: {
			//'keyup .shop-name': 'search',
			'tap .select-one': 'selected'
		},

		initialize: function () {
			this.listenTo(this.model, 'sync', this.render)
			this.listenTo(this.model, 'change', this.render)
			
			this.isSearched = true
		},

		render: function () {
			var self = this

			Tpl.bind(
				'shop/search-result',
				{
					'accounts': this.model.get('results').toJSON(),
					'isSearched': this.isSearched
				},
				function (html) {
					self.$el.html(html)
					App.$module.find('.search-container').html(self.$el)
				}
			)
		},

		selected:function(e){
			var datatext = $(e.currentTarget).attr('innerText')
			var datavalue = $(e.currentTarget).attr('data-value')
			if(this.eventName) {
				App.trigger(this.eventName, {
					id:datavalue, 
					name:datatext,
					selected:false
				})
			}
			window.history.back()
		},

		clear: function(){
			this.$el.find('.shop-name').val('')
		},

		submit: function(e){
			e.preventDefault()
		},

		bindEvent: function(eventName) {
			this.eventName = eventName
		}
	})
})