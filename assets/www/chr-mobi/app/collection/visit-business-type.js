define(['backbone', 'model/visit-business-type'], function(Backbone, VisitBusinessType) {
    var visitBusinessTypes = [{
        name: '道床板结',
        caseType: '道床',
        id: 101,
        className: 'chuang01-icon',
        selected: false
    },{
        name: '道床粉碎',
        caseType: '道床',
        id: 102,
        className: 'chuang02-icon',
        selected: false
    },{
        name: '轨道板开裂',
        caseType: '道床',
        id: 103,
        className: 'chuang03-icon',
        selected: false
    },{
        name: '轨道板离缝',
        caseType: '道床',
        id: 104,
        className: 'chuang04-icon',
        selected: false
    }, {
        name: '钢轨波磨',
        caseType: '钢轨',
        id: 201,
        className: 'gui01-icon',
        selected: false
    },{
        name: '低接头',
        caseType: '钢轨',
        id: 202,
        className: 'gui02-icon',
        selected: false
    },{
        name: '轨头剥离',
        caseType: '钢轨',
        id: 203,
        className: 'gui03-icon',
        selected: false
    },{
        name: '轨头横向裂纹',
        caseType: '钢轨',
        id: 204,
        className: 'gui04-icon',
        selected: false
    },{
        name: '轨头纵向裂纹',
        caseType: '钢轨',
        id: 205,
        className: 'gui05-icon',
        selected: false
    },{
        name: '轨头表面压陷',
        caseType: '钢轨',
        id: 206,
        className: 'gui06-icon',
        selected: false
    },{
        name: '轨腰伤损',
        caseType: '钢轨',
        id: 207,
        className: 'gui07-icon',
        selected: false
    },{
        name: '轨底伤损',
        caseType: '钢轨',
        id: 208,
        className: 'gui08-icon',
        selected: false
    },{
        name: '钢轨折断',
        caseType: '钢轨',
        id: 209,
        className: 'gui09-icon',
        selected: false
    },{
        name: '钢轨锈蚀',
        caseType: '钢轨',
        id: 210,
        className: 'gui10-icon',
        selected: false
    },{
        name: '钢轨磨耗',
        caseType: '钢轨',
        id: 211,
        className: 'gui11-icon',
        selected: false
    },{
        name: '轨头扁疤',
        caseType: '钢轨',
        id: 212,
        className: 'gui12-icon',
        selected: false
    },{
        name: '钢轨侧磨',
        caseType: '钢轨',
        id: 213,
        className: 'gui13-icon',
        selected: false
    },{
        name: '钢轨垂磨',
        caseType: '钢轨',
        id: 214,
        className: 'gui14-icon',
        selected: false
    },{
        name: '光带不良',
        caseType: '钢轨',
        id: 215,
        className: 'gui15-icon',
        selected: false
    },{
        name: '钢轨的其它伤损',
        caseType: '钢轨',
        id: 216,
        className: 'gui16-icon',
        selected: false
    }, {
        name: '扣压力衰减',
        caseType: '扣件',
        id: 301,
        className: 'kou01-icon',
        selected: false
    },{
        name: '螺帽丢失',
        caseType: '扣件',
        id: 302,
        className: 'kou02-icon',
        selected: false
    },{
        name: '扣件断裂',
        caseType: '扣件',
        id: 303,
        className: 'kou03-icon',
        selected: false
    }, {
        name: '路基沉降',
        caseType: '路基',
        id: 401,
        className: 'ji01-icon',
        selected: false
    }, {
        name: '路基隆起',
        caseType: '路基',
        id: 402,
        className: 'ji02-icon',
        selected: false
    }, {
        name: '路基坍塌',
        caseType: '路基',
        id: 403,
        className: 'ji03-icon',
        selected: false
    }, {
        name: '翻浆冒泥',
        caseType: '路基',
        id: 404,
        className: 'ji04-icon',
        selected: false
    }]

    return Backbone.Collection.extend({
        model: VisitBusinessType,

        url: function() {
            return '/visitBusinessTypes'
        },

        initialize: function() {
            this.reset(visitBusinessTypes)
        },

        fetch: function(options) {
            this.reset(visitBusinessTypes)

            if (options && options.success) {
                options.success.apply(this, [this])
            }
        },

        getSelected: function() {
            return this.where({
                selected: true
            })
        },

        getSelected: function(value) {
            var self = this
            var result = []

            var list
            if (value) {
                var list = value.split(';')
            } else {
                list = []
            }

            _.each(self.models, function(businessType) {
                if(_.indexOf(list, businessType.get('name')) == -1) {
                    businessType.set('selected', false)
                } else {
                    businessType.set('selected', true)
                }
                result.push(businessType.toJSON())
            })

            return result
        },

        getSelected: function(value, caseType) {
            var self = this
            var result = []

            var list
            if (value) {
                var list = value.split(';')
            } else {
                list = []
            }

            _.each(self.models, function(businessType) {
                if(_.indexOf(list, businessType.get('name')) == -1) {
                    businessType.set('selected', false)
                } else {
                    businessType.set('selected', true)
                }
                if (caseType && businessType.get('caseType') == caseType) {
                    result.push(businessType.toJSON())
                }
            })

            return result
        },

        findById: function(id) {
            return this.findWhere({
                id: id
            })
        },

        setSelected: function(data) {
            var self = this
            $.each(data, function(index, item) {
                var model = self.findWhere({
                    name: item
                })
                model.set('selected', true)
            })
        }
    })
})