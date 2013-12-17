define([
    'backbone',
    'zepto',
    'app',
    '../../tpl-data-bind',
    '../../../component/number'
], function(Backbone, $, App, Tpl, numUtil) {
    return Backbone.View.extend({
        className: 'visit-add',

        events: {
            'tap .visit-add-ico': 'add'
        },

        initialize: function() {
            this.listenTo(this.collection, 'sync', this.render)
        },

        render: function() {
            var self = this

            Tpl.bind(
                'visit/visit-add', {
                    'visits': this.collection.toJSON(),
                    'baseUrl': ENV.server
                },
                function(html) {
                    self.$el.html(html)
                    App.$visitAdd = self.$el
                    App.$moduleContainer.append(App.$visitAdd)
                }
            )

            return this
        },

        add: function() {
            App.router.navigate('visits/create', {
                trigger: true
            })
        }
    })
})