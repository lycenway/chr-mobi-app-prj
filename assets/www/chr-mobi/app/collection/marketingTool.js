define(['backbone', 'model/marketingTool'], function(Backbone, MarketingTool) {
    return Backbone.Collection.extend({
        model: MarketingTool,

        url: function() {
            return '/marketingTools'
        },

        fetch: function(options) {
            return [{
                name: '销售工具包',
                shortname: '工具包',
                iconname: 'icon-toolspackage',
                id: 1
            }, {
                name: '销售方案ppt',
                shortname: '方案',
                iconname: 'icon-solution',
                id: 2
            }, {
                name: '行业风向标',
                shortname: '风向标',
                iconname: 'icon-windflag',
                id: 3
            }, {
                name: '产品Flash Demo',
                shortname: 'Demo',
                iconname: 'icon-demo',
                id: 4
            }, {
                name: '售后服务报告',
                shortname: '报告',
                iconname: 'icon-report',
                id: 5
            }]
        }
    })
})