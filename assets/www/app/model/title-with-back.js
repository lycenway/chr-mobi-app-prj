define(function (require) {
	var Backbone = require('backbone')

	return Backbone.Model.extend({
		defaults: function () {
			return {
				title: '',
				backUrl: '',
				saveBtn: false,
				isSaveBtnDisabled: false
			}
		}
	})
})
