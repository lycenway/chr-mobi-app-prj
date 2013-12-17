define([
	'backbone',
	'model/contact'
], function (Backbone, Contact) {
	return Backbone.Collection.extend({
		model: Contact
	})
})