define([
	'zepto',
	'backbone',
	'underscore',
	'app',
	'../../tpl-data-bind',
	'./overlay',
	'../../../component/number'
], function ($, Backbone, _, App, Tpl, SettingOverlayView, numUtil) {
	/**
	 * @class 业绩指标显示
	 * @author Kane/yunhua.xiao@dianping.com
	 */
	return Backbone.View.extend({
		className: 'setting',

		events: {
			'tap .parameter dl': 'showSettingOverlay'
		},

		initialize: function () {
			this.listenTo(this.model, 'change', this.render)
		},

		render: function () {
			var self = this
			var data = this.model.toJSON()

			this.format(data)

			Tpl.bind(
				'setting/show',
				data,
				function (html) {
					self.$el.html(html)
					App.$module.html(self.$el)
					self.greyNullQuota(data)
				}
			)

			return this
		},

		greyNullQuota: function (data) {
			var self = this

			_.each(data, function (value, key) {
				if (value !== '未设置') {
					return
				}

				self.$el.find('.' + key).addClass('not-set')
			})
		},

		format: function (data) {
			if (!data) {
				return
			}

			var needFormatAttrs = [
				'salesAmount',
				'teamAmount',
				'salesIncome'
			]

			var self = this

			_.each(needFormatAttrs, function (key) {
				data[key] = self.formatMoney(data[key])
			})

			return data
		},

		formatMoney: function (num){
			if(num == '未设置'){
				return '未设置'
			}

			return numUtil.formatMoney(num)
		},

		showSettingOverlay: function (e) {
			var mark = $(e.currentTarget).attr('data-type')

			var settingOverlay = new SettingOverlayView({ model: this.model.getQuotaByMark(mark) })

			settingOverlay.render()
		}
	})
})