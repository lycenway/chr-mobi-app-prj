define(['backbone', 'model/visit'], function (Backbone, Visit) {
    return Backbone.Collection.extend({
        model: Visit,

        url: function () {
            return '/visits'
        }
    })
})