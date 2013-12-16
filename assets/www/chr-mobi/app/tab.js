define(function (require) {
	var Tab = require('model/tab'),
        Tabs = require('collection/tab'),
        TabsView = require('view/common/tab'),
        App = window.App

    var check = function () {
	   	return App.tabs && App.tabsView
    }

    var createGlobalTabs = function () {
    	App.tabs = new Tabs()
    	App.tabsView = new TabsView({ collection: App.tabs })
    }

    var initTabsEnv = function () {
    	if (!(App.tabs && App.tabsView)) {
			createGlobalTabs()
		}
    }

	var createTabs = function (tabsData) {
		if (!Array.isArray(tabsData)) {
			tabsData = [].slice.call(arguments, 0)
		}

		if (!tabsData) {
			tabsData = []
		}

		return tabsData.map(function (item) {
			return new Tab(item)
		})
	}

	var bindTabs2Nav = function (type, tabsData) {
		App.tabsView.type = type
		App.tabs.reset(createTabs(tabsData))
	}

	return {
		init: initTabsEnv,
		fresh: bindTabs2Nav
	}

})