define([
	'backbone'
], function (Backbone) {
	return Backbone.Model.extend({
        url: 'user',
        
        defaults: function () {
            return {
                UserRole: '',
                LoginId: '',
                EmployeeNumber: '',
                City: ''
            }
        }
    })

})