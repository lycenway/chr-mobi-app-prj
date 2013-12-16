define(['backbone', './data', './quota-show'], function(Backbone, Data, QuotaShow) {

    return Backbone.Model.extend({
        defaults: function() {
            return {
                percentage: {
                    // 个人交易额占比
                    salesAmount: 0,
                    // 团队交易额占比
                    teamAmount: 0,
                    // 在线订单数占比
                    onlineDealGroup: 0,
                    // 在线KAB客户占比
                    onlineKABAccount: 0,
                    // 盈利额占比
                    salesIncome: 0,
                    // 新上线单数占比
                    newDealGroup: 0
                },
                count: {
                    // 个人交易额
                    salesAmount: 0,
                    // 团队交易额
                    teamAmount: 0,
                    // 在线订单数
                    onlineDealGroup: 0,
                    // 在线KAB客户
                    onlineKABAccount: 0,
                    // 盈利额
                    salesIncome: 0,
                    // 新上线单数
                    newDealGroup: 0
                },
                contract: {
                    rejected: 0,
                    inApproval: 0,
                    approved: 0
                },
                dealGroup: {
                    rejected: 0,
                    online: 0,
                    inProduction: 0
                }
            }
        },

        initialize: function() {
            this.dataModel = new Data()
            this.quotaShowModel = new QuotaShow()
        },

        fetch: function(options) {
            var self = this

            var success = function() {
                if (options && options.success) {
                    options.success.apply(this, arguments)
                }
            }

            var error = function() {
                if (options && options.error) {
                    options.error.apply(this, arguments)
                }
            }

            console.log('performance.js model fetch options: ' + JSON.stringify(options))


            this.dataModel.fetch({
                _server: ENV.apiServers.crm,

                _cache: options._cache,
                background: options.background,
                success: function(model, data) {
                    var count = data.performance
                    var contract = data.contract
                    var dealGroup = data.dealGroup

                    self.quotaShowModel.fetch({
                        success: function(model, quota) {

                            self.set({
                                percentage: self.calcPercentage(count, quota),
                                count: count,
                                contract: contract,
                                dealGroup: dealGroup
                            })

                            success.apply(null, [self, self.toJSON()])
                        },

                        error: error
                    })
                },

                error: error
            })
        },

        calcPercentage: function(count, quota) {
            var percentage = {}

            var toCalcAttrs = [
                'salesAmount',
                'teamAmount',
                'salesIncome',
                'onlineDealGroup',
                'onlineKABAccount',
                'newDealGroup'
            ]

            _.each(toCalcAttrs, function(key) {
                var quotaVal = parseFloat(quota[key], 10)
                var countVal = parseFloat(count[key], 10)

                if (isNaN(quotaVal) || quotaVal === 0) {
                    percentage[key] = 0
                    return
                }

                percentage[key] = Math.floor((countVal / quotaVal) * 1000) / 10
            })

            return percentage
        }
    })
})