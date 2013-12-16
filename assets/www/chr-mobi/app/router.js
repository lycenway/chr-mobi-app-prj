define([
    'backbone',
    'app',
    'collection/contact',
    'view/common/list-contact',
    'model/data',
    'device',
    'underscore.string'
], function(Backbone, App, Contacts, ContactsView, Data, Device, _s) {
    require(['config-common','config-env'])
    var swipeQueue = [
        'visits',
        'orders/rejected',
        'contracts/rejected',
        'index'
    ]

    var Router = Backbone.Router.extend({
        routes: {
            '': 'invokeRootModule',
            ':module(/*subroute)': 'invokeModule'
        },

        initialize: function() {
            var self = this
            self.currentSwipeIndex = 0

            App.data = new Data()

            this.refreshData()

            App.contacts = new Contacts()
            new ContactsView({
                collection: App.contacts
            })

            App.$moduleContainer.on('swipeLeft', function() {
                if (self.currentSwipeIndex === -1) {
                    return
                }

                if (!(self.currentSwipeIndex < swipeQueue.length - 1)) {
                    return
                }

                self.currentSwipeIndex++
                self.navigate(swipeQueue[self.currentSwipeIndex], {
                    trigger: true
                })

            }).on('swipeRight', function() {
                if (self.currentSwipeIndex === -1) {
                    return
                }

                if (!(self.currentSwipeIndex > 0)) {
                    return
                }

                self.currentSwipeIndex--
                self.navigate(swipeQueue[self.currentSwipeIndex], {
                    trigger: true
                })
            })
        },

        refreshData: function() {
            document.addEventListener('resume', function() {
                App.data.fetch({
                    _server: ENV.apiServers.crm,

                    _cache: {
                        key: '/index',
                        expiration: 5
                    },

                    success: function() {
                        App.data.set('index', {
                            contract: App.data.get('contract').rejected,
                            order: App.data.get('dealGroup').rejected
                        })
                        console.log('resume fetch number success!')
                    },
                    error: function() {
                        console.error('error fetch data')
                    }
                })
            }, false)
        },

        invokeRootModule: function() {
            this.navigate('visits', {
                trigger: true,
                replace: true
            })
        },

        invokeModule: function(module, subroute) {
            window.isloaded = true

            var prefix = module.toLowerCase()
            var modName = _s.capitalize(prefix)

            if (!App.routers[modName]) {
                requirejs([('module/' + prefix)], function(Mod) {
                    App.routers[modName] = new Mod.Router(prefix, {
                        createTrailingSlashRoutes: true
                    })
                })
            }
        },

        routeStart: function() {
            if (ENV.mock) {
                Backbone.history.start({
                    pushState: false,
                    root: App.root
                })
                return
            }

            Device.readUserInfo()
            Device.registUserDevice()

            Backbone.history.start({
                pushState: false,
                root: null
            })
        },

        setCurrentSwipeIndex: function(index) {
            this.currentSwipeIndex = index
        }
    })

    App.router = new Router()

    App.router.on('route', function() {
        // 切换界面，将回退按钮 tap 次数置为 0
        Device.resetBackButtonTapCount()
    })

    return App.router
})