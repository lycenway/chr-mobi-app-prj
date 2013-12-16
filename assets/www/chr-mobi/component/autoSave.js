define(['cache'], function (Cache) {
    
    function save(key, data) {
        var cacheEntity = Cache.init(key, 'local')
        cacheEntity.set(data)
    }

    function load(key) {
        var cacheEntity = Cache.init(key, 'local')
        return cacheEntity.get()
    }

    function remove(key) {
        var cacheEntity = Cache.init(key, 'local')
        cacheEntity.remove(key)
    }

    return {
        save: save,
        load: load,
        remove: remove
    }
})