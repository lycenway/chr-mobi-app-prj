define([
	'backbone',
	'underscore',
	'../model/quota'
], function (Backbone, _, Quota) {
	var defaults = [
		{
			type: 'tradingVolume',
			title: '个人交易额',
			mark: 'salesAmount',
			quota: '未设置'
		}, {
			type: 'tradingVolume',
			title: '团队交易额',
			mark: 'teamAmount',
			quota: '未设置'
		}, {
			type: 'referenceIndex',
			title: '在线订单数',
			mark: 'onlineDealGroup',
			quota: '未设置'
		}, {
			type: 'referenceIndex',
			title: '在线KAB客户数',
			mark: 'onlineKABAccount',
			quota: '未设置'
		}, {
			type: 'referenceIndex',
			title: '盈利额',
			mark: 'salesIncome',
			quota: '未设置'
		}, {
			type: 'referenceIndex',
			title: '新上线单数',
			mark: 'newDealGroup',
			quota: '未设置'
		}
	]

	/**
	 * 业绩指标集合
	 * @class
	 * @author Kane/yunhua.xiao@dianping.com
	 *
	 * 业绩指标类型
	 * ----------
	 * 交易额：(tradingVolume)
	 * 参考指标：(referenceIndex)
	 * 
	 */
	return Backbone.Collection.extend({
		model: Quota,

		url: function () {
			return '/quotas'
		},

		initialize: function () {
			this.listenTo(this, 'change', this.save)
		},

		// 从 localStorage 中获取数据
		fetch: function (options) {
			// 检查是否需要清除数据
			this.hasToClear('fetch')

			var listJsonStr = localStorage.getItem('db_quotas')
			var list

			if (!listJsonStr) {
				list = this.clear()
			} else {
				list = JSON.parse(listJsonStr)	
				this.reset(list)
			}

			if (options && options.success) {
				options.success(this, list)
			}
		},

		save: function (model) {
			// 检查是否需要清除数据
			if (this.hasToClear('save')) {
				this.saveQuotaByMark(model.get('mark'), model.get('quota'))
			}

			localStorage.setItem('db_quotas_date', +new Date)
			localStorage.setItem('db_quotas', JSON.stringify(this.toJSON()))
		},

		getQuotaByMark: function (mark) {
			return this.findWhere({ mark: mark })
		},

		saveQuotaByMark: function (mark, quota) {
			var model = this.getQuotaByMark(mark)

			if (model) {
				return model.set('quota', quota)
			}
		},

		clear: function () {
			var list =  _.clone(defaults)
			
			this.reset(list)

			return list
		},

		hasToClear: function (flag) {
			var nowDate = new Date()
			// 月初2号清除数据，因为1号需要看3上月1号的数据，不能清除
			var clearDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), 2, 0, 0, 0)
			// 数据存入localStorage的时间
			var setDate = parseInt(localStorage.getItem('db_quotas_date'), 10)

			// 若设置时间超过清除时间，则不用清除
			if (setDate > clearDate.getTime()) {
				return false
			}

			// 若即将设置的时间超过清除时间，但记录的设置时间早于清除时间
			if (nowDate.getTime() > clearDate.getTime()) {
				// 若设置时间早于清除时间，则清除
				localStorage.removeItem('db_quotas')
				localStorage.setItem('db_quotas_date', nowDate.getTime())

				if (flag === 'save') {
					this.clear()
				}
			}

			return true
		}
	})
})