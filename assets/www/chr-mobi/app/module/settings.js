define([
	'backbone',
	'../layout',
	'../model/quota-show',
	'../ga',
	'../view/setting/show'
], function(Backbone, Layout, QuotaShow, gaPlugin, QuotaShowView) {
	var Module = {}

	Module.Router = Backbone.SubRoute.extend({
		routes: {
			'': 'show'
		},

		show: function() {
			Layout.resetLayout('setting')
			Layout.setModuleContainerColor('#fafafa')

            App.router.setCurrentSwipeIndex(-1)

			var quotaShow = new QuotaShow()
			var quotaShowView = new QuotaShowView({
				model: quotaShow
			})

			gaPlugin.sendView(function(data) {
				console.log(data)
			}, null, '/settings')

			quotaShow.fetch({
				success: function() {
					quotaShowView.render()
				}
			})
		}
	})

	return Module
})