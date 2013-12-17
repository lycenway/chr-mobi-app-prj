define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        url: function(){
            return '/account/' + this.get('id')
        },

        idAttribute: '_id',

        defaults: function() {
            return {
                id: '',
                name: '',
                mile: 0,
                mileFrom: 0,
                mileTo: 0
            }
        }
    })
})