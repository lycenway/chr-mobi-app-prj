define([
    'backbone',
    'zepto',
    'app',
    '../../tpl-data-bind'
], function (Backbone, $, App, Tpl) {
    return Backbone.View.extend({
        className: 'service-container',

        events: {
            'tap .service-list li': 'toggleService',
            'tap .order-list .close': 'close'
        },

        initialize: function () {
            //please don't use auto render for this view!!!
            //this.listenTo(this.collection, 'all', this.render)
            var self = this
            this.listenTo(App, 'businessType:default', function(data) {
                self.setSelected(data)
            })
            this.selectedItems = []
        },

        render: function () {
            var self = this

            Tpl.bind(
                'visit/service',
                { 
                    services: this.collection.toJSON(),
                    selectedItems: this.selectedItems
                 },
                function (html) {
                    self.$el.html(html)
                    App.$module.html(self.$el)
                    self.$serviceOrderdList = this.$('.order-list')
                    self.$serviceList = this.$('.service-list')
                }
            )

            return this
        },

        toggleService: function (e) {
            var $elem = $(e.currentTarget)
            var id = parseInt($elem.attr('data-typeid'))

            if ($elem.hasClass('active')) {
                $elem.removeClass('active')
                this.toggleSelectedItem(this.collection.findById(id))
                return
            }

            $elem.addClass('active')

            this.toggleSelectedItem(this.collection.findById(id))
        },

        toggleSelectedItem: function(model) {
            model.toggleSelected()
            if(model.get('selected') == true) {
                this.selectedItems.push(model.toJSON())
            } else {
                var self = this
                $.each(this.selectedItems, function(index, item) {
                    if(item.id == model.get('id')) {
                        self.selectedItems.splice(index,1)
                    }
                })
            }
            this.render()
        },

        add: function (businessType) {
            this.toggleSelectedItem(businessType)
        },

        close: function (e) {
            var $elem = $(e.currentTarget).parent('li')
            var id = parseInt($elem.attr('data-typeid'))
            this.toggleSelectedItem(this.collection.findById(id))
        },

        setSelected: function(data) {
            this.selectedItems = []
            var self = this
            $.each(data, function(index, item) {
                var model = self.collection.findWhere({name: item})
                if(model == null)
                    return
                model.set('selected', true)
                self.selectedItems.push(model.toJSON())
            })
            this.render()
        },

        save: function() {
            var selected = []
            $.each(this.selectedItems, function(index, item) {
                selected.push(item.name)
            })
            App.trigger('businessType:selected', selected)
            window.history.back()
        },

        unbindEvents: function() {
            this.undelegateEvents()
            this.stopListening(App)
        }
    })
})