define([
	'backbone'
], function (Backbone) {
	return Backbone.Model.extend({
		url: 'device/register',
		
        defaults: function() {
            return {
                appId: '',
                token: '',
                type: ''
            }
        }
    })
})