define([
    'zepto',
    'backbone',
    'model/user',
    'model/device',
    'auther',
    'ga',
    '../component/update'
], function($, Backbone, User, Device, auther, gaPlugin, autoUpdate) {
    var backButtonTapCount = 0

    return {
        fixIos7StatuBar: function() {
            document.addEventListener('deviceready', function() {
                if (device.platform === 'iOS' && device.version.indexOf('7.' > -1)) {
                    $('#header').css('margin-top', '15px')
                    $('#module-container').css('padding-top', '20px')
                }
            }, false)
        },

        relpaceAlert: function() {
            if (navigator && navigator.notification && navigator.notification.alert) {

                window.alert = function(message, alertCallback, title, buttonName) {
                    if (!title) {
                        title = '工务先锋 ChrMobi'
                    }
                    navigator.notification.alert(message, alertCallback, title, buttonName)
                }
            }
        },

        bind: function() {
            var self = this

            document.addEventListener('deviceready', function() {
                auther()
                gaPlugin.onload()
                self.bindBackbutton()
                self.relpaceAlert()
                autoUpdate.update()
            }, false)
        },

        readUserInfo: function() {
            setTimeout(function() {
                (new User()).fetch({
                    success: function(data) {
                        gaPlugin.initUserInfo(data)
                        console.log('用户获取成功！')
                    },
                    error: function() {
                        console.error('user fetch error')
                    },
                    background: true
                })
            }, 10000)
        },

        registUserDevice: function() {
            //chao -debug
            // setTimeout(function() {
            //     window.plugins.pushNotification.getInfo(function(device) {
            //         (new Device({
            //             appId: device.appId,
            //             token: device.token,
            //             type: device.type
            //         })).save(null, {
            //             error: function() {
            //                 gaPlugin.sendException(function(data) {
            //                     console.log(data)
            //                 }, function(data) {
            //                     console.log(data)
            //                 }, '设备注册失败！' + JSON.stringify(arguments), false)
            //             },
            //             success: function() {
            //                 console.log('设备注册成功！')
            //             },
            //             background: true
            //         })
            //     }, function() {
            //         gaPlugin.sendException(function(data) {
            //             console.log(data)
            //         }, function(data) {
            //             console.log(data)
            //         }, '设备注册失败！' + JSON.stringify(arguments), false)
            //     })
            // }, 20000)
        },

        bindBackbutton: function() {
            $(document).on('backbutton', function() {
                backButtonTapCount++

                if ((backButtonTapCount % 2 === 0) && confirm('确认退出？')) {
                    navigator.app.exitApp()
                }

                return false
            })
        },

        resetBackButtonTapCount: function() {
            backButtonTapCount = 0
        }
    }
})