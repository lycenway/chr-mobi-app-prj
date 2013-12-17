define([
	'backbone',
	'loading',
	'../app/cache'
], function(Backbone, Loading, Cache) {
	var _BackboneSync = Backbone.sync

	/**
	 * 根据当前运行环境，处理 server 的地址
	 * @param  {Object} options backbone或用户自定义
	 * @return {String} 当前接口请求的 server 地址
	 */
	var processServer = function(options) {
		//var server

		if (options._server) {
			server = options._server + (options._server.lastIndexOf('/') === options._server.length - 1 ? '' : '/')
		}

		if (ENV.mock) {
			server = ENV.server || (location.protocol + '//' + location.host + App.root)
			server += (server.lastIndexOf('/') === server.length - 1 ? '' : '/') + 'mock/'
		}

		console.log('connector server ' + server)

		return server
	}

	/**
	 * 处理接口地址
	 * @param  {Object} model backbone的model
	 * @param  {Object} options backbone或用户自定义
	 * @return {String} 接口地址
	 */
	var processPath = function(model, options) {
		var path = options.url ? options.url : (typeof model.url === 'string' ? model.url : model.url())

		return path.indexOf('/') === 0 ? path.substring(1) : path
	}

	/**
	 * 处理跨域请求 salesforce 或其他 restful API所需的 RequestHeader
	 * @param  {Object} options backbone或用户自定义
	 */
	var processBeforeSend = function(options) {
		/*if (ENV.forcetkClient) {
			console.log('ENV.forcetkClient.authzHeader is ' + ENV.forcetkClient.authzHeader)
			console.log('ENV.forcetkClient.sessionId is ' + ENV.forcetkClient.sessionId)

			options.beforeSend = function(xhr) {
				//xhr.setRequestHeader(ENV.forcetkClient.authzHeader, "Bearer " + ENV.forcetkClient.sessionId)
				xhr.setRequestHeader('Authorization', "Bearer " + ENV.forcetkClient.sessionId)
				if (ENV.forcetkClient.userAgentString !== null) {
					xhr.setRequestHeader('User-Agent', ENV.forcetkClient.userAgentString)
					xhr.setRequestHeader('X-User-Agent', ENV.forcetkClient.userAgentString)
				}
			}
		}*/
	}

	/**
	 * 服务器端返回 code 500 处理函数
	 */
	var code500Error = function() {
		console.error('request code 500 ', arguments)
	}

	/**
	 * 处理接口请求错误处理函数
	 * @param  {Object} options backbone或用户自定义
	 */
	var processErrorCallback = function(method, model, options) {

		// 用户错误处理函数
		var customeError = options.error

		var errorCbFn = function(xhr, errorType, error) {

			//gaPlugin.sendException(null, null, gaPlugin.getXhrErrorMessage(xhr, options.url, method), false)

			if (options.startTime) {
				//gaPlugin.sendTiming(null, null, 'ajax', new Date().getTime() - options.startTime, options.url, 'error')
			}

			customeError.apply(this, arguments)
			if (!options.background || options.background == false) {
				Loading.hide()
			}
		}

		options.error = function(xhr, errorType, error) {
			console.error('errorType: ' + errorType + ' ;error: ' + error)
			errorCbFn.apply(null, arguments)
		}
	}

	/**
	 * 处理接口请求成功处理i函数
	 * @param  {Object} options backbone或用户自定义
	 */
	var processSuccessCallback = function(options) {
		var _success = options.success

		options.success = function(data, status, xhr) {
			if (data.code !== 200) {
				options.error.apply(null, [xhr, 'response code 500', new Error('response code 500')])
				return
			}
			_success.apply(null, [data.msg])

			if (!options.background || options.background == false) {
				Loading.hide()
			}

			if (options.startTime) {
				//gaPlugin.sendTiming(null, null, 'ajax', new Date().getTime() - options.startTime, options.url, new Date().getTime() - options.startTime < 1000 * 60 ? 'success' : 'error')
			}
		}
	}

	/**
	 * 处理数据缓存
	 * @param  {String} method 请求类型：`create`, `update`, `patch`, `delete`, `read`
	 * @param  {Object} model 请求数据的 backbone model
	 * @param  {Object} options backbone或用户自定义
	 */
	var cacheData = function(options) {
		if (!options._cache) {
			return
		}

		var success = options.success

		options.success = function(data, status, xhr) {
			options._cache.wrapSuccess.apply(options._cache, [success, options.error, data, status, xhr, options.afterUpdateCache])
		}
	}

	/**
	 * 从本地获取数据
	 * @param  {String} method  请求类型：`create`, `update`, `patch`, `delete`, `read`
	 * @param  {Object} model   请求数据的 backbone model
	 * @param  {[type]} options backbone或用户自定义
	 */
	var requestFromCache = function(options, next) {
		var beforeUpdateCache = options._cache.beforeUpdateCache ? options._cache.beforeUpdateCache : Loading.showUpdateCache
		var afterUpdateCache = options._cache.afterUpdateCache ? options._cache.afterUpdateCache : Loading.hideUpdateCache
		options._cache = Cache.init(options._cache.key, options._cache.type, options._cache.expiration)

		options._cache.cache(next, options.success, beforeUpdateCache, afterUpdateCache, options.background)
	}

	var requestFromServer = function(method, model, options) {
		// 处理 success 回调集
		processSuccessCallback(options)

		// 处理数据缓存本地或 memory
		cacheData(options)

		console.log('requestFromServer xhr options: ' + JSON.stringify(options))

		// 适配 zepto 与 backbone
		options.xhr = undefined
		console.log('requestFromServer before: ' + method + ', model: ' + 
			JSON.stringify(model) + ', options: ' + JSON.stringify(options))
		// 调用 Backbone 的 sync
		_BackboneSync(method, model, options)

		//console.log('requestFromServer after: ' + method + ', model: ' + 
		//	JSON.stringify(model) + ', options: ' + JSON.stringify(options))
	}

	var getLoadingText = function(method) {
		if (method == 'read') {
			return '加载中...'
		}
		return '保存中...'
	}

	return Backbone.sync = function(method, model, options) {
		if (!options.background || options.background == false) {
			// 显示加载中
			Loading.show(getLoadingText(method))
		}

		// 处理请求接口地址：server + path
		options.url = processServer(options) + processPath(model, options)

		console.log('in backbone.sync options.url is ' + options.url)

		// 处理跨域请求头
		processBeforeSend(options)

		// 处理 error 回调集
		processErrorCallback(method, model, options)

		// 是否 cache 请求 
		options.cache = false

		//chao - debug
		options.crossDomain = true

		if (!options._cache) {
			options.startTime = new Date()
			requestFromServer(method, model, options)
			return
		}

		// 从 cache 中获取数据
		requestFromCache(options, function(afterUpdateCache) {
			options.startTime = new Date()
			if (afterUpdateCache) {
				options.afterUpdateCache = afterUpdateCache
			}
			requestFromServer(method, model, options)
		})
	}
})
/**
 * salesforce 和其他 resetful API 数据访问adapter
 * --------------------------------------------
 *
 * 思路：
 * ----
 * > 覆写 Backbone.sync，在调用 Backbone.sync 之前对 options 加工
 *
 * TODO:
 * -----
 * 1. 将 success 和 error 回调函数切面化，方便扩展多层面的回调；
 * 2. 重构 processCache，解决 cache 与业务代码的耦合；
 * 3. 重构 gaPlugin, 解决 gaPlugin 与业务代码的耦合；
 * 4. ...
 *
 * TODO - 1 - 思路：
 * ---------------
 * > 实现 callbacks 机制
 * > 解耦合 process options
 *
 * TODO - 2 - 思路:
 * ---------------
 *
 */