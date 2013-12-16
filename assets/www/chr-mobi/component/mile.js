define([], function () {
    var formatMile = function (num) {
        return getMileString(Math.floor(num), Math.floor((num-Math.floor(num))*1000))
    }

    var getMileString = function(km, m) {
        return 'K' + km + '+' + m
    }

    return {
        formatMile: formatMile
    }
})