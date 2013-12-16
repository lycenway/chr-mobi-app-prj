define(['backbone', 'model/visitIssue'], function(Backbone, VisitBusinessType) {
    return Backbone.Collection.extend({
        model: VisitBusinessType,

        url: function() {
            return '/visitIssue'
        },

        fetch: function(options) {
            return [{
                name: '约不到关键性人物',
                id: 1
            }, {
                name: '难与客户建立信任',
                id: 2
            }, {
                name: '挖掘不到客户需求',
                id: 3
            }, {
                name: '客户对产品不认可',
                id: 4
            }, {
                name: '客户不愿支付费用',
                id: 5
            }]
        }
    })
})