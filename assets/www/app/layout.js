define([
    'zepto',
    'app',
    'model/header',
    'view/common/header',
    'view/common/mask',
    'nav',
    'tab'
], function ($, App, Header, HeaderView, MaskView, Nav, Tab) {
    App.Nav = Nav
    App.Tab = Tab

	var layoutConfig = {
    	visits: {
            header: {
                name: '采集',
                backUrl: 'index.html'
            },
            top: '3em',
            bottom: '0em'
        },
        'visit-edit': {
            header: {
                name: '采集',
                backUrl: 'index.html'
            },
            top: '3em',
            bottom: '0em'
        },
        orders: {
            header: {
                name: '台帐',
                backUrl: 'index.html'
            },
            top: '3em',
            bottom: '3em'
        },
        contracts: {
            header: {
                name: '分析',
                backUrl: 'index.html'
            },
            top: '3em',
            bottom: '3em'
        },
        index: {
    		header: {
    			name: '作业',
    			backUrl: null
    		},
    		top: '3em',
            bottom: '3em'
    	},
        setting: {
            header: {
                name: '设置',
                backUrl: 'index.html'
            },
            top: '0em',
            bottom: '0em'
        },
        shop: {
            top: '2.5em',
            bottom: '0'
        },
        'visit-service': {
            top: '2.5em',
            bottom: '0'
        }
    }

    var layoutTabConfig = {
        index: [
            {
                type: 'contract',
                text: '处理中病害',
                num: 0
            },
            {
                type: 'order',
                text: '问题设备',
                num: 0
            }
        ],
        contract: [
            {
                type: 'rejected',
                text: '未完作业',
                num: 0,
                active: false
            }, {
                type: 'inapproval',
                text: '作业中',
                num: 0,
                active: false
            }, {
                type: 'approved',
                text: '完成作业',
                num: 0,
                active: false
            }
        ],
        order: [
            {
                type: 'rejected',
                text: '问题设备',
                num: 0,
                active: false
            }, {
                type: 'inproduction',
                text: '作业中设备',
                num: 0,
                active: false
            }, {
                type: 'online',
                text: '正常设备',
                num: 0,
                active: false
            }
        ]
    }

    var typeDataMap = {
        inapproval: 'inApproval',
        inproduction: 'inProduction'
    }


    return {
    	init: function () {
    		var self = this

            // 初始化选项卡数据及view
            App.Tab.init()

            // 初始化遮罩
            App.maskView = new MaskView()
    	},

        resetLayout: function (path) {
            App.$pullUpEl = null
            
            this.clearModule()

            if (path === 'visits') {
                this.clearTab()
            } else {
                this.clearAddVisit()
            }

            if (App.iscroll && App.iscroll.scrollToPage) {
                App.iscroll.scrollToPage(0, 0, 1)
            }

            if (path === 'setting' || path === 'shop' || path === 'visit-service') {
                this.clearTab()
                this.clearHeader()
            } else {
                App.Nav.fresh(path)
            }

            this.placeModuleContainer(layoutConfig[path])
        },

    	placeModuleContainer: function (path) {
    		App.$moduleContainer.css({ 'top': path.top })

            App.$moduleContainer.css({ 'bottom': path.bottom })
    	},

        setModuleContainerColor: function(color) {
            App.$moduleContainer.css({ 'background-color': color })
            App.$module.css({ 'background-color': color })
        },

        freshTab: function (category, type, data) {
            layoutTabConfig[category].forEach(function (item) {
                item.num = data[typeDataMap[item.type] || item.type]
                if (category !== 'visits') {
                    item.active = type === item.type
                }
            })

            App.Tab.fresh(category + 's', layoutTabConfig[category])
        },

    	/**
         * 清除选项卡容器
         */
        clearTab: function () {
            App.$tab.empty()
        },

        /**
         * 清除add visit
         */
        clearAddVisit : function() {
            if(App.$visitAdd) {
                App.$visitAdd.remove()
                App.$visitAdd = null           
            }
        },

        /**
         * 清除header容器
         */
        clearHeader: function() {
            App.$header.empty()
        },

        /**
         * 清除模块容器
         */
        clearModule: function () {
            App.$module.empty()
        }
    }
})
