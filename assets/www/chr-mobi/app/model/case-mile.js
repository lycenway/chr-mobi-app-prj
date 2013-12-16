define(['backbone'], function (Backbone) {
    return Backbone.Model.extend({
        defaults: function() {
            return {
                num: '',
                kiloShow: ''
            }
        }
    })
})