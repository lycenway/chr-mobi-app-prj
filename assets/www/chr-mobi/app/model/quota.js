define(['backbone', 'underscore'], function (Backbone, _) {
	/**
	 * @class 业绩指标
	 * @author Kane/yunhua.xiao@dianping.com
	 * 
	 * 业绩指标类型
	 * ----------
	 * 
	 * 交易额：(tradingVolume)
	 * ----------------------
	 * - 个人交易额(salesAmount) quota 值为：'未设置'、'金额或数量'
	 * - 团队交易额(teamAmount) quota 值为：'未设置'、'金额或数量'
	 *
	 * 参考指标：(referenceIndex)
	 * -------
	 * - 在线订单数(onlineDealGroup) quota 值为：'未设置'、'金额或数量'
	 * - 在线KAB客户数(onlineKABAccount) quota 值为：'未设置'、'金额或数量'
	 * - 盈利额(salesIncome) quota 值为：'未设置'、'金额或数量'
	 * - 新上线单数(newDealGroup) quota 值为：'未设置'、'金额或数量'
	 *
	 * 例如：
	 * ----
	 * { type: 'tradingVolume', mark: 'salesAmount', title: '个人交易额', quota: 12345 }
	 * 
	 */
	var Quota = Backbone.Model.extend({
		defaults: function () {
			return {
				type: '',
				title: '',
				mark: '',
				quota: ''
			}
		},

		validate: function (attrs) {
			var numReg = /^\d+.*\d*$/

			if (!numReg.test(attrs.quota)) {
				return attrs.title + '必须为全数字且大于0'
			}
		}
	}, {
		getTitleByMark: function (mark) {
			var quotaMarkTitleMap = {
				salesAmount: '个人交易额',
				teamAmount: '团队交易额',
				onlineDealGroup: '在线定单数',
				onlineKABAccount: '在线KAB客户数',
				salesIncome: '盈利额',
				newDealGroup: '新上线单数'
			}
			
			return quotaMarkTitleMap[mark]
		}
	})

	return Quota
})