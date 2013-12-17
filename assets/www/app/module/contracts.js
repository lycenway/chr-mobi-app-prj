define([
    'backbone',
    '../layout',
    '../collection/contract',
    '../view/contract/list',
    '../view/common/blank'
], function(Backbone, Layout, Contracts, ContractsView, BlankView) {
    var Module = {}

    Module.Router = Backbone.SubRoute.extend({
        routes: {
            '(:type)': 'list'
        },

        list: function(type) {
            //gaPlugin.sendView(function(data) {
                console.log(data)
            }, null, '/contracts/' + type)

            var startTime = gaPlugin.start()

            App.router.setCurrentSwipeIndex(1)

            Layout.resetLayout('contracts')
            Layout.freshTab('contract', type, App.data.get('contract'))
            Layout.setModuleContainerColor('#e6e6e6')

            if (type == 'rejected') {
                if (App.data.get('contract').rejected == 0) {
                    var blankView = new BlankView()
                    blankView.render('恭喜，没有驳回信息！')
                    return
                }
            }

            var temp = 0

            if (type == 'rejected') {
                temp = App.data.get('contract').rejected
            } else if (type == 'inapproval') {
                temp = App.data.get('contract').inApproval
            } else {
                temp = App.data.get('contract').approved
            }

            if (temp == 0) {
                return (new BlankView()).render()
            }

            if (App.views.contractsView) {
                App.views.contractsView.undelegateEvents()
            }

            var contracts = new Contracts({
                type: type
            })

            var contractsView = App.views.contractsView = new ContractsView({
                collection: contracts
            })

            contracts.fetch({
                _cache: {
                    key: '/contracts/' + type,
                },
                success: function() {
                    //gaPlugin.end('/contracts/' + type, startTime, 'success')
                },
                error: function() {
                    //gaPlugin.end('/contracts/' + type, startTime, 'error')
                    alert('加载失败，请重试。')
                }
            })
        }
    })

    return Module
})