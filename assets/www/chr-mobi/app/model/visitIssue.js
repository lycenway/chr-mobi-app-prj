define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        url: function(){
            return '/visitIssue/' + this.get('id')
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