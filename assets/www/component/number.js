define([], function () {
	var clearMoney = function (num) {
        if (num == null) {
            num = ''
        }

        return num.toString().replace(/[^-.\d]/g, '')
    }

    var formatMoney = function (num) {
        var isNegative = false
        var isFloat = false

        var b = parseFloat(clearMoney(num)).toString()

        if (b < 0) {
            isNegative = true
            b = b.substring(1)
        }

        if (b.indexOf('.') !== -1) {
        	isFloat = true
        	var bArr = b.split('.')
            b = b.split('.')[0]
        }

        var len = b.length;

        if (len <= 3) {
            return (isNegative ? '-' : '') + b
        }

        var r = len % 3;

        var formatedStr = r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",")

        return (isNegative ? '-' : '') + formatedStr + (isFloat ? '.' + bArr[1] : '')
    }

    return {
    	formatMoney: formatMoney
    }
})