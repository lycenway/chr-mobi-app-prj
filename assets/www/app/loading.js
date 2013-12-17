define([
	'zepto'
], function($) {
	var $loadingPopup = $('<section class="loading-popup">加载中...</section>').appendTo(document.body).hide()
	var $updateCache = $('<div id="cache-update"><span></span><span class="pull-down-loading"></span></div>').hide()

	return {
		show: function(content) {
			var winWidth = $(window).width()

			if (!App.isLoading) {
				App.isLoading = true

				content = content === undefined ? '加载中' : content
				$loadingPopup.text(content)

				$loadingPopup.show()
			}
		},
		hide: function() {
			if (App.isLoading) {
				App.isLoading = false
				$loadingPopup.hide()
			}
		},
		showUpdateCache: function() {
			if (App.$module.find('#cache-update').length == 0) {
				$updateCache.prependTo(App.$module)
			}
			$updateCache.show()
		},
		hideUpdateCache: function() {
			$updateCache.hide()
		}
	}
})