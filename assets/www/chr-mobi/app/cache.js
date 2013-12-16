define(['loading'], function(Loading) {
    var memoryCache = {}

    var memorySet = function(value) {
        memoryCache[this.key] = value
    }

    var memoryGet = function() {
        return memoryCache[this.key]
    }

    var memoryRemove = function() {
        delete memoryCache[this.key]
    }

    var localSet = function(value) {
        window.localStorage.setItem(this.key, JSON.stringify(value));
    }

    var localGet = function() {
        return JSON.parse(window.localStorage.getItem(this.key));
    }

    var localRemove = function() {
        window.localStorage.removeItem(this.key);
    }

    //只有 ajax 请求会调用
    var wrapSuccess = function(success, error, data, status, xhr, afterUpdateCache) {
        if (data.code !== 200) {
            error.apply(null, [xhr, status, null])
            return
        }

        var newData = JSON.stringify(data)
        var oldEntity = this.get()
        var oldData = oldEntity && oldEntity.data ? JSON.stringify(oldEntity.data) : null
        var oldTime = oldEntity && oldEntity.data ? oldEntity.time : null

        this.set({
            data: data,
            time: new Date().getTime()
        })
        if (afterUpdateCache) {
            afterUpdateCache()
        }

        //没有过期并且数据没有变化
        if (!this.forceRefresh && newData === oldData) {
            console.log('data not change')
            return
        }

        success(data, status, xhr)
    }

    var cache = function(call, success, beforeUpdateCache, afterUpdateCache, background) {
        if (this.forceRefresh) {
            call()
            return
        }
        if (!background || background == false) {
            // 显示加载中
            Loading.show()
        }

        //检查是否有缓存
        var cacheData = this.get(this.key)
        if (!cacheData) {
            this.updateCache(call, beforeUpdateCache, afterUpdateCache)
            return
        }

        success.apply(null, [cacheData.data.msg])
        Loading.hide()

        //检查是否过期
        if (this.expiration || this.expiration === 0) {
            if (cacheData.time + this.expiration < new Date().getTime()) {
                console.log('cache expired: ' + this.key)
                this.updateCache(call, beforeUpdateCache, afterUpdateCache)
                return
            }
        }

    }

    var updateCache = function(call, beforeUpdateCache, afterUpdateCache) {
        if (beforeUpdateCache) {
            beforeUpdateCache()
        }
        call(afterUpdateCache)
    }

    var init = function(key, type, expiration) {
        var cacheEntity = {
            key: key,
            cache: cache,
            updateCache: updateCache,
            wrapSuccess: wrapSuccess,
            forceRefresh: false
        }

        if (type == 'memory') {
            cacheEntity.set = memorySet
            cacheEntity.get = memoryGet
            cacheEntity.remove = memoryRemove
        } else {
            cacheEntity.set = localSet
            cacheEntity.get = localGet
            cacheEntity.remove = localRemove
        }

        //expiration's unit is in minutes
        cacheEntity.expiration = expiration || expiration === 0 ? expiration * 1000 * 60 : 6 * 60 * 1000 * 60

        // force refresh means always fetch data from server
        if (cacheEntity.expiration == 0) {
            cacheEntity.forceRefresh = true
        }

        return cacheEntity
    }

    return {
        init: init
    }
})



//todo:
//1. type 加一种类型：hybrid
//2. cache 变成单例
//3. 事件机制