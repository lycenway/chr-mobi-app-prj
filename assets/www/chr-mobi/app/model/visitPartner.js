define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        url: function(){
            return '/visitPartner/' + this.get('id')
        },

        idAttribute: '_id',

        defaults: function() {
            return {
                id: '',
                name: ''
            }
        }
    })
})