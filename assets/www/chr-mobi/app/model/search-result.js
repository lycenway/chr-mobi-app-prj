define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        url: function(){
            return '/account/' + this.get('id')
        },

        idAttribute: '_id',

        defaults: function() {
            return {
                keyword: '',
                results: []
            }
        }
    })
})