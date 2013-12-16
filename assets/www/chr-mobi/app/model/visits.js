define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        url: function(){
            return '/visitInfo'
        },

        idAttribute: '_id',

        defaults: function() {
            return {
                metric: {
                    visitNumberByWeek: 0,
                    visitNumberByMonth: 0,
                    visitNumberByDay: 0
                },
                visitList: []
            }
        }
    })
})