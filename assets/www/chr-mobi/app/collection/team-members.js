define(['backbone', 'model/visitPartner','collection/visitPartner'], function (Backbone, VisitPartner, VisitPartners) {
    var teamMembers = Backbone.Collection.extend({
        model: VisitPartner,

        url: function () {
            return '/teamMembers'
        },
        
        byName: function(options){
            var users = new VisitPartners()
            users.byName({
                data: options.data,
                success: function (results) {
                    options.success.apply(this, [results])
                }
            })
        },

        save: function(id,name){           
            App.visit.get('partner').set({
                id:id,
                name:name
            })
        }
    })
    return teamMembers
})