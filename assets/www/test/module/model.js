define([
	'model/contact',
	'model/contract',
	'model/quota',
    'root/component/number',
    'root/component/date',
    'root/component/autoSave'
], function(Contact, Contract, Quota, numUtil, dateUtil, autoSave) {
    QUnit.module("Model", {
        setup: function() {
            this.contract = new Contract()
            this.quota = new Quota()
        }
    })

    test('contract', function () {
    	equal(this.contract.get('id'), '', '默认id应为空字符串')
    	
    	this.contract.set({
    		id: 123
    	})

    	equal(this.contract.url(), '/contract/123', 'url 地址应为 /contract/ + id')
    })

    test('quota', function () {
    	var quotaMarkTitleMap = {
			salesAmount: '个人交易额',
			teamAmount: '团队交易额',
			onlineDealGroup: '在线定单数',
			onlineKABAccount: '在线KAB客户数',
			salesIncome: '盈利额',
			newDealGroup: '新上线单数'
		}

        _.each(_.keys(quotaMarkTitleMap), function (key) {
            equal(Quota.getTitleByMark(key), quotaMarkTitleMap[key], 'Mark title must be ' + quotaMarkTitleMap[key])
        })
    })

    test('Number util', function () {
        equal(numUtil.formatMoney(123), '123', '不足千位的正数应返回该正数的字符串')
        equal(numUtil.formatMoney(12344), '12,344', '超过千位的正数应返回带千分符的字符串')
        equal(numUtil.formatMoney(-123), '-123', '不足千位的负数应返回该负数的字符串')
        equal(numUtil.formatMoney(-12345), '-12,345', '超过千位的负数应返回带千分符的的字符串并带上负号')
        equal(numUtil.formatMoney(-12973.4569), '-12,973.4569', '千分符应对小数部分无效')
        equal(numUtil.formatMoney('-1,297,3.4569'), '-12,973.4569', '有千分符的数应先去掉千分符然后返回加入正确千分符后的结果')
        equal(numUtil.formatMoney('-1*2*9+73.4569'), '-12,973.4569', '应去掉非数字和非数字修饰字符，再加入千分符')
    })

    test('Date util', function () {
        equal(dateUtil.formatDate(new Date('2013-09-22')), "9月22日，周日", '格式化的日期包括月份，日期和周几')
    })

    test('Auto Save', function() {
        var data = {
            name: "test",
            child: {
                name: "test2"
            }
        }
        autoSave.save("testAutoSave", data)
        deepEqual(data, autoSave.load("testAutoSave"))
        autoSave.remove("testAutoSave")
        equal(null, autoSave.load("testAutoSave"))
    })
})