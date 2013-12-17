define([
    'backbone',
    '../layout',
    '../model/performance',
    '../view/index/performance',
    '../view/index/histogram'
], function(Backbone, Layout, Performance, PerformanceView, HistogramView) {
    var Module = {}

    Module.Router = Backbone.SubRoute.extend({
        routes: {
            '': 'show'
        },

        show: function() {
            //var startTime = gaPlugin.start()

            App.router.setCurrentSwipeIndex(0)

            var self = this

            Layout.resetLayout('index')
            Layout.setModuleContainerColor('#fafafa')

            // 业绩图表
            var performance = new Performance()
            var performanceView = new PerformanceView({
                model: performance
            })

            // 个人业绩数目及占比
            var histogramView = new HistogramView({
                model: performance
            })

            performance.fetch({
                _cache: {
                    key: '/index'
                },

                success: function(modal, data) {
                    //设置Tab数字
                    App.data.set('contract', data.contract)
                    App.data.set('dealGroup', data.dealGroup)

                    App.data.set('index', {
                        contract: App.data.get('contract').rejected,
                        order: App.data.get('dealGroup').rejected
                    })

                    //刷新Tab
                    Layout.freshTab('index', 'contract', App.data.get('index'))


                    performanceView.render()

                    histogramView.render()

                    //gaPlugin.firstOpen('success')
                    //gaPlugin.end('/index', startTime, 'success')
                },
                error: function() {
                    //gaPlugin.firstOpen('error')
                    //gaPlugin.end('/index', startTime, 'error')
                    console.error('performance fetch error.')
                    alert('加载失败，请重试。')
                }
            })
        }
    })

    return Module
})