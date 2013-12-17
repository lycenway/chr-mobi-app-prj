define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        url: function(){
            return '/visitCaseType/' + this.get('id')
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