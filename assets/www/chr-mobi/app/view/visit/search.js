define([
	'backbone',
	'app',
	'../../tpl-data-bind',
	'./search-result',
	'../../../component/autoSave'
], function (Backbone, App, Tpl, searchResult, LocalCache) {
	return Backbone.View.extend({
		className: 'shop-search-container',

		events: {
			'tap .clear': 'clear',
			'submit .shop-form': 'submit',
			'tap .shop-search-container': 'focusKeyword'
		},

		initialize: function () {
			this.isSearched = true
		},

		render: function () {
			var self = this
			Tpl.bind(
				'shop/search',
				{
					'accounts': this.model.get('results').toJSON(),
					'condition': this.model.get('keyword'),
					'isSearched': this.isSearched
				},
				function (html) {
					self.$el.html(html)
					App.$module.html(self.$el)
					self.$keyword = self.$el.find('.shop-name')
					
					self.searchTextInterval()
				}
			)
			this.renderResult()
		},

		focusKeyword: function (e) {
			this.$keyword.get(0).focus()
		},

		renderResult:function(){
			var self = this
			var result = App.views.searchResult = new searchResult({
				model: this.model
			})
			if(this.eventName){
				result.bindEvent(this.eventName)
			}
			//result.parentView = self
			//console.log('result.$el',result.$el)
			result.render()
		},

		getCondition: function(){
			this.$searchShopText = this.$keyword
			return this.$searchShopText.attr('value')
		},

		searchTextInterval: function(){
			var self = this
			var hash = Backbone.history.getHash()
			var condition = self.getCondition()
			if(_.isUndefined(condition)){
				condition = ''
			}
			var t = setInterval(function(){
				if(Backbone.history.getHash() != hash){
					clearInterval(t)
					return
				}
				if(condition !== self.getCondition())
				{
					condition = self.getCondition()
					self.search(condition)
				}
			}, 250)
		},

		search: function(condition){
			var self = this
			this.isSearched = true
			this.model.get('results').byName({
				data: {
					keyword: condition
				},
				success: function (results) {
					self.model.set({
						results:results,
						keyword: condition
					})
				}
			})
		},

		selected:function(e){
			var datatext = $(e.currentTarget).attr('innerText')
			var datavalue = $(e.currentTarget).attr('data-value')
			if(this.eventName) {
				App.trigger(this.eventName, {
					id:datavalue, 
					name:datatext
				})
			}
			window.history.back()
		},

		clear: function(){
			this.$keyword.val('')
		},

		submit: function(e){
			e.preventDefault()
		},

		bindEvent: function(eventName) {
			this.eventName = eventName
		}
	})
})