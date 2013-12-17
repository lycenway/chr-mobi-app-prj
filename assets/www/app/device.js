define([
    'zepto',
    'backbone',
    'model/user',
    'model/device',
    '../component/update'
], function($, Backbone, User, Device, autoUpdate) {
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
                self.bindBackbutton()
                self.relpaceAlert()
                autoUpdate.update()
            }, false)
        },

        readUserInfo: function() {
            setTimeout(function() {
                (new User()).fetch({
                    success: function(data) {
                        //gaPlugin.initUserInfo(data)
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
            //
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