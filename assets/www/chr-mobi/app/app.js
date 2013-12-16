define([
    'backbone',
    'zepto',
    'device',
    'iscroll',
    'fastclick',
    'ga',
    '../component/update',
    '../component/connector',
    'subroute'
], function(
    Backbone, $, device, iScroll, attachFastClick, gaPlusin, autoUpdate
) {
    require(['config-common','config-env'])

    var APP = function() {
        this.init()
    }

    APP.prototype = _.extend({
        constructor: APP,

        views: {},

        routers: {},

        init: function() {
            this.handleError()
            autoUpdate.check()

            var self = this
            var pathname = location.pathname

            this.root = location.pathname.substring(0, pathname.lastIndexOf('/') + 1)

            $(document).on("touchmove", function(e) {
                var target = e.target

                var $visitCreateContainer = $(e.target).parents('.visitCreateContainer')
                var isVisitCreateContainer = $(e.target).hasClass('visitCreateContainer')

                while (target.nodeType != 1) {
                    target = target.parentNode
                }

                if (!$visitCreateContainer.length && !isVisitCreateContainer && target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                    e.preventDefault()
                }
            })

            $(function() {
                attachFastClick.attach(document.body);
                self.$header = $('#header')
                self.$tab = $('#footer')
                self.$footer = $('#footer')
                self.$module = $('#module-scroller')
                self.$moduleContainer = $('#module-container')

                self.iscroll = new iScroll('module-container', {
                    useTransform: true,

                    tapOffset: 50,

                    onBeforeScrollStart: function(e) {
                        var target = e.target

                        while (target.nodeType != 1) {
                            target = target.parentNode
                        }

                        if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                            e.preventDefault()
                        }
                    },

                    checkDOMChanges: true
                })

                self.proxyAnchor()
                device.bind()
            })
        },

        handleError: function() {
            window.onerror = function(error, url, line) {
                console.error('=============js error=============')
                console.error(error)
                console.error(url)
                console.error(line)
                console.error('=============js error=============')

                var errorEntity = {}
                errorEntity.error = error
                errorEntity.url = url
                errorEntity.line = line

                gaPlusin.sendException(function(data) {
                    console.log(data)
                }, function(data) {
                    console.log(data)
                }, JSON.stringify(errorEntity), false)
            }
        },

        proxyAnchor: function() {
            var self = this

            $(document).on('click', 'a[href]:not([data-bypass])', function(evt) {
                var href = {
                    prop: $(this).prop('href'),
                    attr: $(this).attr('href')
                }

                var root = location.protocol + '//' + location.host + self.root

                if (href.prop.slice(0, root.length) === root) {
                    evt.preventDefault()
                    Backbone.history.navigate(href.attr, true)
                }
            })
        }
    }, Backbone.Events)

    window.App = new APP()

    App.noop = function () {}

    return App
})