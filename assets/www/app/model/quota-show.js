define([
	'backbone',
	'underscore',
	'app',
	'../collection/quota'
], function (Backbone, _, App, QuotaList) {
	/**
	 * @class 业绩指标扁平模型 
	 * @description mark 与 Quota 形成对应关系
	 * @author Kane/yunhua.xiao@dianping.com
	 * 
	 * 例如：
	 * ----
	 * {
	 * 		salesAmount: '未设置/金额',
	 * 		teamAmount: '未设置/金额',
	 * 		onlineDealGroup: '未设置/金额'
	 * }
	 */
	return Backbone.Model.extend({
		defaults: function () {
			return {
				"salesAmount": '未设置',
				"teamAmount": '未设置',
				"onlineDealGroup": "未设置",
				"onlineKABAccount": "未设置",
				"salesIncome": "未设置",
				"newDealGroup": "未设置"
			}
		},

		initialize: function () {
			this.__quotas = new QuotaList()

			this.listenTo(this.__quotas, 'change', this.updateWitchQuotas)
		},

		fetch: function (options) {
			var self = this

			var success = function () {
				if (options && options.success) {
					options.success.apply(this, arguments)
				}
			}

			this.__quotas.fetch(_.defaults({
				success: function () {
					self.updateWitchQuotas()

					success.apply(null, [self, self.toJSON()])
				}
			}, options))
		},

		// 生成 mark -> quota 对象
		// 成为 model 数据
		updateWitchQuotas: function () {
			var modelData = {}

			_.each(this.__quotas.toJSON(), function (item) {
				modelData[item.mark] = item.quota
			})

			this.set(modelData)
		},

		saveQuotaByMark: function (mark, quota) {
			return this.__quotas.saveQuotaByMark(mark, quota)
		},

		getQuotaByMark: function (mark) {
			return this.__quotas.getQuotaByMark(mark)
		}
	})
})