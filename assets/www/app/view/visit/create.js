define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind',
	'./create-select-status',
	'./create-select-casetype',
	'./create-select-date',
	'./create-select-casemile'
	'app/../../component/autoSave',
	'../../loading',
	'../../collection/selected-account',
	'../../../component/autogrow-textarea'
], function(Backbone, $, App, Tpl, SelectStatusView, SelectCaseTypeView, SelectStatusDate, SelectCaseMile, localCache, Loading, SelectedAccounts) {
	return Backbone.View.extend({
		className: 'visitCreateContainer',
		
		events: {
			'tap .partner-name': 'selectPartner',
			'tap .visit-status-edit': 'showSelectStatus',
			'tap .shop-name-edit': 'showShopNameSelect',
			'tap .visit-mate-edit': 'showVisitMateSelect',
			'tap .visit-date-edit': 'showDateSelect',
			'tap .visit-type-edit .bigiconframe': 'setVisitType',
			'swipeRight .visit-mate-edit': 'removePartner',
			'tap .marketing-tools .container': 'selectMarketingTool',
			'tap .caseimage-tools .container': 'setCasePicture',
			'tap .visit-casetype-edit': 'showSelectCaseType',
			'tap .case-mile-edit': 'showCaseMile'
		},

		initialize: function() {
			this.listenTo(this.model, 'change', this.render)

			var self = this
			/*
			 * we use listenTo to bind event to App
			 * then we have to unbind the events when this view is not used
			 * or this view will not be garbage collected and might cause other issues
			 */
			this.listenTo(App, 'account:selected', function(account) {
				self.setAccount(account)
			})

			this.listenTo(App, 'user:selected', function(partner) {
				self.setPartner(partner)
			})

			this.listenTo(App, 'businessType:selected', function(businessTypes) {
				self.setBusinessType(businessTypes)
			})
		},

		createTextAreaInterval: function() {
			var self = this
			var hash = Backbone.history.getHash()

			if(!self.descriptionInterval) {
				self.descriptionInterval = setInterval(function() {
					if (Backbone.history.getHash() != hash) {
						clearInterval(self.descriptionInterval)
						return
					}

					self.model.set({
						'description': $.trim(self.$textarea.val())
					}, {
						silent: true
					})
				}, 250)
			}
		},

		render: function() {
			var self = this

			Tpl.bind(
				'visit/create', {
					'visit': this.model.toViewJSON()
				},
				function(html) {
					self.$el.html(html)
					App.$module.html(self.$el)
					self.$textarea = self.$('.visit-description textarea')

					self.createTextAreaInterval()
				}
			)

			return this
		},

		setCasePicture: function(e) {
			var self = this
			
            var $currentTarget = $(e.currentTarget)
            var $img = $currentTarget.find('.img')
            //var $caseimage = $img.find('.caseimage')
            //console.log('camera e: ' , $currentTarget)
            //console.log('camera img: ' , $img)
            //console.log('camera caseimage: ' , $caseimage)
            //console.log('this model ' + self.model)

			if ($currentTarget.hasClass('visit-img-album-tap')) {
				Camera.sourceType = Camera.PictureSourceType.PHOTOLIBRARY
			}
			navigator.camera.getPicture(
				function(imageData) {
					//$caseimage.attr('src', "" + imageData)
					//$container.$('.img').src = imageData
					self.model.setCasePicture(imageData)
					console.log('camera base64' + imageData)
				},
				function(message) {
					alert('camera issues: ' + message)
				},
				{ quality: 50,
    			 destinationType: Camera.DestinationType.DATA_URL
    			 //destinationType: Camera.DestinationType.FILE_URI
				}
			)
		},

		selectMarketingTool: function (e) {
			var $container = $(e.currentTarget)
			this.model.setMarketingTools($container.attr('data-value'),
				$container.hasClass('active')) 
		},

		selectPartner: function(e) {
			var $currentTarget = $(e.currentTarget)
			this.model.setPartner({
				id: $currentTarget.attr('data-value'),
				name: $currentTarget.attr('data-text'),
				selected: $currentTarget.hasClass('selected')
			})
		},

		showSelectStatus: function(e) {
			var selectStatus = new SelectStatusView({
				model: this.model
			})
			selectStatus.render()
		},

		showSelectCaseType: function(e) {
			var selectCaseType = new SelectCaseTypeView({
				model: this.model
			})
			selectCaseType.render()
		},

		showDateSelect: function(e) {
			var selectDate = new SelectStatusDate({
				model: this.model
			})
			selectDate.render()
		},

		showShopNameSelect: function(e) {
			var shopName = $.trim($(e.currentTarget).find('.shop-name').text())

			App.router.navigate('visits/search-shop/' + shopName, {
				trigger: true
			})
		},

		showCaseMile: function(e) {
			var selectCaseMile = new SelectCaseMile({
				model: this.model
			})
			selectCaseMile.render()
		},

		showVisitMateSelect: function() {
			App.router.navigate('visits/search-sales', {
				trigger: true
			})
		},

		showVisitType: function() {
			App.router.navigate('visits/service', {
				trigger: true
			})
			App.trigger('businessType:default', this.model.get('businessType').split(';'))
		},

		setVisitType: function(e) {
			var $currentTarget = $(e.currentTarget)

			this.model.setBusinessType($currentTarget.attr('data-value'),
				$currentTarget.hasClass('not-selected'))
		},

		save: function() {
			this.model.save(null, {
				success: function(model, response, options) {
					setTimeout(function() {
						Loading.show('保存成功！')
						setTimeout(function() {
							Loading.hide()
							App.router.navigate('visits', {
								trigger: true
							})
							localCache.remove('draftVisit')
							App.views.visitsView.triggerSwipeDown()
						}, 500)
					}, 100)
				},
				
				error: function(model, xhr, options) {
					try {
						var response = JSON.parse(xhr.response)
						var message = 'error'
						if (response) {
							message = response.msg ? response.msg : response
						}
						alert(message)
					} catch (e) {
						alert('error')
					}
				}
			})
		},

		back: function() {
			this.setCache(this.model)
		},

		loadCache: function() {
			var temp = this.model.clone()

			temp.set(localCache.load('draftVisit'))
			return temp
		},

		setCache: function(data) {
			localCache.save('draftVisit', data.toJSON())
		},

		setAccount: function(account) {
			this.model.set('account', account)
			this.selectAccount(account)
			this.back()
		},

		selectAccount: function(account) {
			SelectedAccounts.addSelectedAccount(account)
		},

		setPartner: function(partner) {
			this.model.setPartner(partner)
			this.back()
		},

		/**
		 * 清除选中的 partner
		 * 注: 附加功能 非产品提出
		 */
		removePartner: function() {
			this.model.set('partner', {})
		},

		setBusinessType: function(businessTypes) {
			this.model.set('businessType', businessTypes.join(';'))
			this.back()
		},

		unbindEvents: function() {
			this.undelegateEvents()
			this.stopListening(App)
		}
	})
})
