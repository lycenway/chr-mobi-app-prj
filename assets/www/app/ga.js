define(['underscore'], function(_) {
    require(['config-common','config-env'])
    var noop = function() {}

    var plugin = {
        init: null,
        sendEvent: null,
        sendView: null,
        sendTiming: null,
        sendException: null,
        setCustomDimension: null,
        setCustomMetric: null,
        getLoginInfo: null
    }

    window.plugins || (window.plugins = {})
    window.plugins.gaPlugin || (window.plugins.gaPlugin = plugin)

    _.each(plugin, function(fn, name) {
        plugin[name] = window.plugins.gaPlugin[name] || noop
    })

    var extral = (function() {

        var getUserInfo = function() {
            var user = JSON.parse(window.localStorage.getItem("userInfo"))
            return user
        }

        var setGaUserInfo = function(success) {
            var userInfo = getUserInfo()

            if (userInfo) {
                plugin.setCustomDimension(function(data) {
                    plugin.setCustomDimension(function(data) {
                        plugin.setCustomDimension(function(data) {
                            console.log('用户信息：' + JSON.stringify(userInfo))
                            success && success()
                        }, null, 4, userInfo.EmployeeNumber)
                    }, null, 3, userInfo.UserRole)
                }, null, 2, userInfo.City)
            } else {
                console.log('没有用户信息')
                success && success()
            }
        }

        var setGaCustomDimension = function() {
            var loaded = function() {
                plugin.sendEvent(function(data) {
                    console.log(data)
                }, null, "system", "loaded", JSON.stringify(new Date()))
            }

            plugin.setCustomDimension(function(data) {
                setGaUserInfo(loaded)
            }, null, 1, ENV.env)
        }

        var setUserLoginInfo = function() {
            plugin.getLoginInfo(function(data) {
                plugin.sendTiming(function(data) {
                    console.log(data)
                }, null, 'system', new Date().getTime() - data.time, data.type, 'success')
            }, null)
        }

        return {
            initUserInfo: function(user) {
                window.localStorage.setItem("userInfo", JSON.stringify(user))
                setGaUserInfo()
            },

            onload: function() {
                plugin.init(function() {
                    setGaCustomDimension()
                    setUserLoginInfo()
                }, null, 'UA-44932098-1', 10)

                document.addEventListener("resume", function() {
                    plugin.sendEvent(null, null, "system", "resume", JSON.stringify(new Date()))
                }, false)
            },

            getXhrErrorMessage: function(xhr, url, method) {
                var error = {}

                error.method = method
                error.url = url

                for (var p in xhr) {
                    try {
                        error[p] = xhr[p]
                    } catch (exp) {
                        error[p] = exp.message
                    }
                }

                return JSON.stringify(error)
            },

            firstOpen: function(result) {
                if (ENV.openTime) {

                    plugin.sendTiming(function(data) {
                        console.log(data)
                    }, null, 'view', +new Date - ENV.openTime, '/', result)

                    ENV.openTime = null
                }
            },

            start: function() {
                return +new Date
            },

            end: function(path, startTime, result) {
                plugin.sendTiming(function(data) {
                    console.log(data)
                }, null, 'view', +new Date - startTime, path, result)
            }
        }
    })()

    return _.extend(plugin, extral)
})