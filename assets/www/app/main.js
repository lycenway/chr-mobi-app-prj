define([
	'zepto',
	'app',
	'router',
	'layout'
], function($, App, Router, Layout) {
	//remove after publish new app
	var reload_page = setInterval(function() {
		if (!window.isloaded) {
			console.log('load failed!')
			if (navigator && navigator.app && navigator.app.exitApp && confirm('网络不给力！\nT.T 你好像加载失败了…\n是否退出后重新打开？')) {
				navigator.app.exitApp()
			}
		} else {
			clearInterval(reload_page)
			console.log('load success!')
		}
	}, 30000)
	//==========================

    require(['config-common','config-env'])

	Layout.init()

	App.router.routeStart()

	$('.loading-container').remove()
})