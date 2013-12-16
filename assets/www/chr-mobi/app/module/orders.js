define([
    'backbone',
    '../layout',
    'collection/order',
    'view/order/list',
    '../view/common/blank',
    '../ga'
], function(Backbone, Layout, Orders, OrdersView, BlankView, gaPlugin) {
    var Module = {}

    Module.Router = Backbone.SubRoute.extend({
        routes: {
            '(:type)': 'list'
        },

        list: function(type) {
            gaPlugin.sendView(function(data) {
                console.log(data)
            }, null, '/orders/' + type)

            var startTime = gaPlugin.start()

            App.router.setCurrentSwipeIndex(2)

            Layout.resetLayout('orders')
            Layout.freshTab('order', type, App.data.get('dealGroup'))
            Layout.setModuleContainerColor('#e6e6e6')

            if (type == 'rejected') {
                if (App.data.get('dealGroup').rejected == 0) {
                    var blankView = new BlankView()
                    blankView.render('恭喜，没有驳回信息！')
                    return
                }
            }

            var temp = 0,
                opt = {}

            if (type == 'rejected') {
                temp = App.data.get('dealGroup').rejected
            } else if (type == 'inproduction') {
                temp = App.data.get('dealGroup').inProduction
            } else {
                temp = App.data.get('dealGroup').online
                opt._server = ENV.apiServers.crm
            }

            if (temp == 0) {
                return (new BlankView()).render()
            }

            if (App.views.ordersView) {
                App.views.ordersView.undelegateEvents()
            }

            var orders = new Orders({
                type: type
            })

            var ordersView = App.views.ordersView = new OrdersView({
                collection: orders
            })

            orders.fetch(_.extend({
                _cache: {
                    key: '/orders/' + type,
                },

                data: {
                    limit: ordersView.limit,
                    offset: ordersView.offset
                },

                success: function() {
                    gaPlugin.end('/orders/' + type, startTime, 'success')
                },

                error: function() {
                    gaPlugin.end('/orders/' + type, startTime, 'error')
                    alert('加载失败，请重试。')
                }
            }, opt))
        }
    })

    return Module
})