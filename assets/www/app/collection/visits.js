define(['backbone',
    'model/visits',
    './visit-business-type'
], function(Backbone, Visits, VisitBusinessTypeCollection) {
    var Visits = Backbone.Collection.extend({
        model: Visits,

        url: function() {
            return '/visitInfo'
        },

        toViewJSON: function() {
            var self = this
            var data = this.toJSON()
            $.each(data[0].visitList, function(index, model) {
                model.businessType = (new VisitBusinessTypeCollection).getSelected(model.businessType, model.caseType)
                model.description = self.formatVisitDescription(model.description)
            })
            return data
        },

        convertToArray: function(value, array) {
            if (!value) {
                value = ''
            }
            var list = value.split(';')

            $.each(array, function(index, item) {
                if ($.inArray(item.name, list) > -1) {
                    item.selected = true
                }
            })
        },

        formatVisitDescription: function(desc) {
            if (!desc || desc.length <= 50) {
                return desc
            }
            return desc.substring(0, 50) + '...'
        }
    })
    return Visits
})