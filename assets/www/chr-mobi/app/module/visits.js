define([
    'backbone',
    '../layout',
    'model/visit',
    'collection/visits',
    'model/search-result',
    'collection/selected-account',
    'collection/team-members',
    'view/visit/list',
    'view/visit/visit-add',
    'view/visit/create',
    '../model/title-with-back',
    '../view/header/title-with-back',
    '../view/visit/search',
    'collection/visit-business-type',
    '../view/visit/service',
    '../view/common/blank',
    '../cache',
    '../ga',
    '../../component/autoSave'
], function(Backbone, Layout, Visit, VisitsList, SearchAccount, Accounts, VisitPartner, VisitsView, VisitAddView, VisitsCreateView, Header, HeaderView, SearchView, VisitBusinessTypes, ServiceView, BlankView, Cache, gaPlugin, autoSave) {
    var Module = {}
    Module.Router = Backbone.SubRoute.extend({
        routes: {
            '': 'list',
            'create': 'create',
            'search-shop': 'loadMyAccount',
            'search-shop/:id': 'loadDefaultAccount',
            'search-sales': 'loadTeamMember',
            'search-sales/:id': 'loadAllSales',
            'service': 'showService'
        },

        list: function(type) {
            var startTime = gaPlugin.start()

            App.router.setCurrentSwipeIndex(3)

            Layout.resetLayout('visits')
            Layout.setModuleContainerColor('#e6e6e6')

            if (App.views.visitsView) {
                App.views.visitsView.undelegateEvents()
            }

            if (App.views.visitAddView) {
                App.views.visitAddView.undelegateEvents()
            }

            var visitsList = new VisitsList()

            var visitsView = App.views.visitsView = new VisitsView({
                collection: visitsList
            })
            var visitAddView = App.views.visitAddView = new VisitAddView({
                collection: visitsList
            })

            gaPlugin.sendView(function(data) {
                console.log(data)
            }, null, '/visits')

            visitsList.fetch(_.extend({
                _cache: {
                    key: '/visits',
                    expiration: 60
                },

                success: function() {
                    gaPlugin.end('/visits', startTime, 'success')
                },

                error: function() {
                    gaPlugin.end('/visits', startTime, 'error')
                    alert('加载失败，请重试。')
                }
            }))
        },

        create: function() {
            gaPlugin.sendView(App.noop, null, '/visits/create')

            // 设置滑动切换所需的当前tab索引
            // 可以移出去，监听 router 的变化
            App.router.setCurrentSwipeIndex(-1)

            // 更换布局
            Layout.resetLayout('visit-edit')
            Layout.setModuleContainerColor('#e6e6e6')

            // 创建并显示header
            var header = new Header()

            var headerView = new HeaderView({
                model: header
            })

            header.set({
                title: '采集',
                saveBtn: true
            })

            // 创建 Visit 
            var visit = new Visit()

            var savedVisit = autoSave.load('draftVisit')

            if (savedVisit != null) {
                visit.set(savedVisit)
            }

            var visitsView = new VisitsCreateView({
                model: visit
            })

            visitsView.render()

            // 覆写 header 保存和回退处理函数
            headerView.delegatedSave = function() {
                if (!visit.isValid()) {
                    return
                }
                
                visitsView.save()
            }

            headerView.delegatedBack = function() {
                visitsView.back()
            }

            // 设置默认协访人
            if(_.isEmpty(visit.get('partner'))){
                this.setDefaultPartner(visit)
            }

            // 设置保存按钮初始状态
            headerView.disableSaveBtn(!visit.isValid())
            // 监听 model 数据，并更新保存按钮状态
            visit.on('change', function () {
                headerView.disableSaveBtn(!visit.isValid())
            })

            // 禁用 iscroll 并支持原生滚动
            this.changeModulePositionType(true)
            App.iscroll.disable()

            var hash = Backbone.history.getHash()
            var self = this
            
            var t = setInterval(function() {
                if (Backbone.history.getHash() != hash) {
                    clearInterval(t)
                    
                    self.changeModulePositionType(false)
                    App.iscroll.enable()
                    
                    return
                }
                autoSave.save('draftVisit', visit.toJSON())
            }, 500)
        },

        setDefaultPartner: function (visit) {
            (new VisitPartner()).fetch({
                _cache: {
                    key: '/teamMembers',
                },
                success: function(results) {
                    if (!results || !results.length) {
                        return
                    }

                    var partner = results.at(0)

                    visit.set('partner',{
                        id: partner.get('id'),
                        name: partner.get('name')
                    })
                }
            })
        },

        changeModulePositionType: function (flag) {
            App.$header.css({
                'width': '100%',
                'position': flag ? 'fixed' : 'absolute'
            })
            App.$moduleContainer.css({
                'position': flag ? 'relative' : 'absolute'
            })

            App.$module.css({
                'position': flag ? 'relative' : 'absolute'
            })
        },

        loadMyAccount: function() {
            this.searchShop(false, null)
        },

        loadDefaultAccount: function(id) {
            this.searchShop(true, {
                id: id
            })
        },

        searchShop: function(hasDefault, params) {
            gaPlugin.sendView(function(data) {
                console.log(data)
            }, null, '/visits/search-shop')

            var startTime = gaPlugin.start()
            var header = new Header()
            var headerView = new HeaderView({
                model: header
            })
            var startTime = gaPlugin.start()

            Layout.resetLayout('shop')
            Layout.setModuleContainerColor('#f2f2f2')

            header.set({
                title: '选线|段|里程'
            })
            
            var shops = new Accounts()
            shops.getSelectedAccounts({
                success: function(results) {
                    var searchAccount = new SearchAccount()

                    if (App.views.visitSearchView) {
                        App.views.visitSearchView.undelegateEvents()
                    }

                    var searchView = App.views.visitSearchView = new SearchView({
                        model: searchAccount
                    })
                    searchView.bindEvent('account:selected')
                    if (hasDefault) {
                        searchAccount.set({
                            keyword: params.id,
                            results: results,
                            isSearched: true
                        })
                    } else {
                        searchAccount.set({
                            results: results,
                            isSearched: false
                        })
                    }
                    searchView.render()
                    gaPlugin.end('/searchShop', startTime, 'success')
                },
                error: function() {
                    gaPlugin.end('/searchShop', startTime, 'error')
                }
            })
        },

        loadAllSales: function(id) {
            this.searchSales(true, {
                id: id
            })
        },

        loadTeamMember: function() {
            this.searchSales(false, null)
        },

        searchSales: function(hasDefault, params) {
            gaPlugin.sendView(function(data) {
                console.log(data)
            }, null, '/visits/search-sales')

            var startTime = gaPlugin.start()
            var header = new Header()
            var headerView = new HeaderView({
                model: header
            })

            var partners = new VisitPartner()
            var searchAccount = new SearchAccount()

            if (App.views.visitSearchView) {
                App.views.visitSearchView.undelegateEvents()
            }

            var searchView = App.views.visitSearchView = new SearchView({
                model: searchAccount
            })
            searchView.bindEvent('user:selected')
            Layout.resetLayout('shop')
            Layout.setModuleContainerColor('#f2f2f2')

            header.set({
                title: '陪同人'
            })
            //searchView.render()
            partners.fetch(_.extend({
                _cache: {
                    key: '/teamMembers',
                },
                success: function(results) {
                    if (hasDefault) {
                        searchAccount.set({
                            keyword: params.id,
                            results: results
                        })
                    } else {
                        searchAccount.set({
                            results: results
                        })
                    }
                    searchView.render()
                    gaPlugin.end('/searchSales', startTime, 'success')
                },
                error: function() {
                    gaPlugin.end('/searchSales', startTime, 'error')
                }
            }))
        },

        showService: function() {
            var header = new Header()

            var headerView = new HeaderView({
                model: header
            })

            if (App.views.visitServiceView) {
                App.views.visitServiceView.unbindEvents()
            }

            var visitBusinessTypes = new VisitBusinessTypes()
            var serviceView = App.views.visitServiceView = new ServiceView({
                collection: visitBusinessTypes
            })

            headerView.delegatedSave = function() {
                serviceView.save()
            }

            Layout.resetLayout('visit-service')
            Layout.setModuleContainerColor('#f2f2f2')

            header.set({
                title: '病害类型',
                saveBtn: true
            })

            visitBusinessTypes.fetch()
        }
    })

    return Module
})
