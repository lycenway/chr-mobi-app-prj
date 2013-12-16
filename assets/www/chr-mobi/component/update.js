define([], function() {
    require(['config-common','config-env'])
    var storage = window.localStorage

        function check() {
            if (storage.getItem('version') !== ENV.version) {
                var notShowNewApp = storage.getItem('notShowNewApp')

                storage.clear()
                console.log('js 版本更新！')
                storage.setItem('version', ENV.version)

                if (ENV.whatIsNew) {
                    alert(ENV.whatIsNew)
                }

                storage.setItem('notShowNewApp', notShowNewApp)
            }
        }

        function update() {
            if (!storage.getItem('notShowNewApp') && ENV.appWhatIsNew) {
                if (window.confirm('版本更新\n' + ENV.appWhatIsNew + '\n是否打开更新页面？')) {
                    window.open(ENV.updateUrl, '_system')
                } else {
                    if (window.confirm('是否不再提示版本更新？')) {
                        storage.setItem('notShowNewApp', 1)
                    }
                }

            }
        }

    return {
        check: check,
        update: update
    }
})