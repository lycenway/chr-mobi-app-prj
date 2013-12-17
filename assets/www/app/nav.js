define([
    'app',
    'model/nav',
    'collection/nav',
    'view/common/nav'
], function (App, Nav, Navs, NavsView) {
    var create = function (type) {
    	App.indexMenu = new Nav({
            type: 'index',
            text: '作业',
            url: 'index',
            active: type === 'index'
        })

        App.contractMenu = new Nav({
            type: 'contracts',
            text: '分析',
            url: 'contracts/rejected',
            active: type === 'contracts'
        })

        App.orderMenu = new Nav({
            type: 'orders',
            text: '台帐',
            url: 'orders/rejected',
            active: type === 'orders'
        })

        App.visitMenu = new Nav({
            type: 'visits',
            text: '采集',
            url: 'visits',
            isNew: true,
            active: type === 'visits'
        })

        App.settingMenu = new Nav({
            type: 'settings',
            text: '',
            url: 'settings',
            active: type === 'settings'
        })

        App.navs = new Navs()
        App.navsView = new NavsView({ collection: App.navs })

        App.navs.reset([
            App.visitMenu,
            App.orderMenu,         
            App.contractMenu,
            App.indexMenu,
            App.settingMenu
        ])
    }

    var fresh = function (type) {
        if (App.navs && App.navsView) {
            App.navsView.selectItemByType(type)
            return
        }

        create(type)
    }

    return {
    	fresh: fresh,

    	create: create
    }
})
