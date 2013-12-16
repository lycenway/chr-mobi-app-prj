define(['backbone', 'model/visitPartner'], function(Backbone, VisitPartner) {
    var visitPartner = Backbone.Collection.extend({
        model: VisitPartner,

        url: function() {
            return '/searchuser'
        },

        byName: function(options) {
            this.fetch({
                data: {
                    userName: options.data.keyword
                },
                success: function(results) {
                    options.success.apply(this, [results])
                }
            })
        },

        save: function(id, name) {
            App.visit.get('partner').set({
                id: id,
                name: name
            })
        }
    })
    return visitPartner
})