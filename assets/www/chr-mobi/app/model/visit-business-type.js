define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        url: function(){
            return '/visitBusinessType/' + this.get('id')
        },

        idAttribute: '_id',

        defaults: function() {
            return {
                id: '',
                name: '',
                className: '',
                selected: false
            }
        },

        toggleSelected: function () {
            this.set('selected', !this.get('selected'))
        }
    })
})