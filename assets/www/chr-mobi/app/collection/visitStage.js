define(['backbone', 'model/visitStage'], function(Backbone, VisitStage) {
    return Backbone.Collection.extend({
        model: VisitStage,

        url: function() {
            return '/visitStages'
        },

        fetch: function(options) {
            return [{
                name: '轻微',
                id: 1
            }, {
                name: '需关注',
                id: 2
            }, {
                name: '尽快处理',
                id: 3
            }, {
                name: '立即停运',
                id: 4
            }, {
                name: '其他',
                id: 5
            }]
        }
    })
})