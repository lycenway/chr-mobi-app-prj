define([], function () {
    var weekDay = ['周日','周一','周二','周三','周四','周五','周六']

    var formatDate = function (date) {
        return getDateString(date.getMonth() + 1, date.getDate(), date.getDay())
    }

    var getDateString = function(month, day, dayInWeek) {
        return month + '月' + day + '日，' + weekDay[dayInWeek]
    }

    var formateStdString = function(date) {
        return date.getFullYear() + '-' + formatLeadingZero(date.getMonth() + 1) + '-' + formatLeadingZero(date.getDate())
    }

    var formatLeadingZero = function(number) {
        return number < 10 ? '0' + number : number;
    }

    return {
        formatDate: formatDate,
        formateStdString: formateStdString
    }
})