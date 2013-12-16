define(['underscore', 'ga'], function (_, gaPlugin) {
    var _templates = {}

	return {
		bind: function (tplName, data, callback) {
            var startTime = +new Date

            var rTpl = _templates[tplName]
            // 若在运行时环境中存在该模板，
            // 则直接执行回调函数
            if (rTpl) {
                callback(rTpl(data))
                return
            }

            var self = this

            var locTpl = localStorage.getItem(tplName)
            var compiledTpl

            // 若在本地存储中存在该模板，
            // 则编译模板并缓存到运行时环境中，并执行回调函数
            if (locTpl) {
                compiledTpl = _templates[tplName] = _.template(locTpl)
                callback(compiledTpl(data))
                return
            }

            var tplUrl = (ENV.mock ? '.' : ENV.server)
                + '/app/template/'
                + tplName
                + '.htm'

            $.get(tplUrl, function(html) {
                gaPlugin.sendTiming(
                    null,
                    null,
                    'template',
                    new Date - startTime,
                    tplName,
                    new Date - startTime < 1000 * 60 ? 'success' : 'error'
                )

                // 存本地
                localStorage.setItem(tplName, html)
                // 存运行时
                compiledTpl = _templates[tplName] = _.template(html)
                callback(compiledTpl(data))
            })
        }
	}
})