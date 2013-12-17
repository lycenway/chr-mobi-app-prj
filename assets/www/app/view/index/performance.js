define([
	'backbone',
	'zepto',
	'app',
	'../../tpl-data-bind',
	'../../../component/keyframe',
	'../../../component/number'
], function(Backbone, $, App, Tpl, Keyframe, numUtil) {
	return Backbone.View.extend({
		tagName: 'div',

		className: 'annulus-container',

		initialize: function() {
			this.$pullDown = $('<div class="pull-down"></div>')
			this.bindRefresh()

			this.listenTo(this.model, 'change', this.render)
			this.hash = Backbone.history.getHash()
		},

		bindRefresh: function() {
			var self = this

			this.$el.on('swipeDown', function() {
				if (self.isRefresh) {
					return
				}

				if (App.iscroll.y > 8) {
					self.$pullDown.addClass('pull-down-loading')
					self.isRefresh = true

					self.model.fetch({
						_server: ENV.apiServers.crm,
						_cache: {
							key: '/index',
							expiration: 0
						},
						background: true,
						success: function() {
							self.isRefresh = false
							self.$pullDown.removeClass('pull-down-loading')
						},
						error: function() {
							self.isRefresh = false
							self.$pullDown.removeClass('pull-down-loading')
							alert('加载失败，请重试。')
						}
					})
				}
			})
		},

		render: function() {
			if (this.hash !== Backbone.history.getHash()) return this
			var self = this

			var data = this.model.toJSON()

			data.count.salesAmount = numUtil.formatMoney(data.count.salesAmount)
			data.count.teamAmount = numUtil.formatMoney(data.count.teamAmount)

			self.$el.appendTo(App.$module)

			Tpl.bind(
				'index/performance',
				data,
				function(html) {
					self.$el.html(html)

					self.$el.before(self.$pullDown)

					self.$annulusContainer = self.$el.find('.annulus-container')

					self.$inner = self.$el.find('.inner-annulus')
					self.$innerRateContainer = self.$el.find('.inner-annulus-progress-container')
					self.$innerRateContainerInner = self.$el.find('.inner-annulus-progress-container-inner')
					self.$innerRate = self.$innerRateContainer.find('.inner-annulus-progress')

					self.$outer = self.$el.find('.outer-annulus')
					self.$outerRateContainer = self.$el.find('.outer-annulus-progress-container')
					self.$outerRateContainerOuter = self.$el.find('.outer-annulus-progress-container-inner')
					self.$outerRate = self.$el.find('.outer-annulus-progress')

					self.$teamAmount = self.$el.find('.team-amount')
					self.$personalCompleteness = self.$el.find('.personal-completeness')

					self.adapt()

					$(window).on('resize', function() {
						self.adapt()
					})
				}
			)

			return this
		},

		/**
		 * 计算完成度对应度数
		 * @param  {Number} deviceWidth 设备宽度
		 * @param  {Number} radius 外环外圆半径
		 */
		calcRadian: function(deviceWidth, radius) {
			// 最大度数（与屏幕相关）
			var teamAngleDeg = Math.round(Math.asin(deviceWidth / (2 * radius)) / Math.PI * 180 * 2)
			// 起始度数（与屏幕相关）
			var teamStartDeg = (180 - teamAngleDeg) / 2

			// 销售个人起始度数和最大度数固定，销售是半圆环进度
			var salesAngleDeg = 180
			var salesStargDeg = 0

			// 团队完成百分比
			var teamPerformance = this.model.get('percentage').teamAmount
			// 销售个人完成百分比
			var salesPreformance = this.model.get('percentage').salesAmount

			// 团队完成度对应的圆弧度数
			var teamRotateDeg = teamStartDeg + teamAngleDeg * teamPerformance / 100 - 180
			// 销售个人完成度对应的圆弧度数
			var salesRotateDeg = salesStargDeg + salesAngleDeg * salesPreformance / 100 - 180

			/*//console.log('>> ', teamRotateDeg, salesRotateDeg)*/

			var EXTRAL_ROTATE_DEG = 10

			if (teamPerformance >= 100) {
				teamRotateDeg = teamStartDeg + teamAngleDeg - 180 + EXTRAL_ROTATE_DEG
			}

			if (teamPerformance <= 0) {
				teamRotateDeg = teamStartDeg - 180 - EXTRAL_ROTATE_DEG
			}

			if (salesPreformance >= 100) {
				salesRotateDeg = 0
			}

			// 设定团队和销售个人完成度圆弧度数
			Keyframe.changeKeyFrames('bounceInOuter', teamRotateDeg)

			Keyframe.changeKeyFrames('bounceInInner', salesRotateDeg)
		},

		/**
		 * 圆环和字适应屏幕
		 */
		adapt: function() {
			// 设备总宽度
			var deviceW = $(window).width()

			//console.log('============ 设备信息 ============')
			//console.log('设备总宽度：' + deviceW)

			// 内圆环与设备边界之间的间距
			var padding = deviceW * 15 / 100

			// 内圆环外圆半径
			var innerOuterRadius = (deviceW - 2 * padding) / 2

			// 环形内圆半径与圆环厚度之比
			// 如：若 scale = 1，则 r1 = r2 = innerOuterRadius / 2
			var scale = 1

			// 内圆环厚度
			// 
			// 计算方法
			// 方程一：scale = radius/thickness
			// 方程二：radius + thickness = outerRadius
			// 
			// 解二元一次方程得:
			// radius = outerRadius * scale / (scale + 1)
			// thickness = outerRadius / (scale + 1) 
			var innerThickness = innerOuterRadius / (scale + 1)

			// 内圆环内圆半径
			var innerInnerRadius = innerOuterRadius - innerThickness

			// 进度环轴心坐标
			// var centerLeft = innerOuterRadius
			// var centerTop = innerOuterRadius

			//console.log('============ 内环参数 ============')
			//console.log('圆环位置：（' + innerLeft + ', ' + innerTop + '）')
			//console.log('外圆半径：' + innerOuterRadius)
			//console.log('内圆半径：' + innerInnerRadius)
			//console.log('圆环厚度：' + innerThickness)
			//console.log('边框宽度：' + innerThickness)
			//console.log('边框圆角半径：' + innerInnerRadius * 2)

			// 外环内圆和内环外圆之间的环形厚度与内环外圆半径之比
			// 如：
			// 若 scale2 = 0.5，
			// 则 middleThickness = innerOuterRadius * 0.5
			// 且 outerInnerRadius = innerOuterRadius * (0.5 + 1)
			var scale2 = 0.5

			// 外环内圆半径
			var outerInnerRadius = innerOuterRadius * (scale2 + 1)

			// 外环厚度与外环内圆之比
			// 如：
			// 若 scale3 = 1/21，则 outerThickness = outerInnerRadius * (1 / 21)
			var scale3 = 1 / 21

			// 外环厚度
			outerThickness = outerInnerRadius * scale3

			// 外环外圆半径
			outerOuterRadius = outerThickness + outerInnerRadius

			// 外环定位
			var outerLeft = padding
			var outerTop = 3

			// 内环定位
			var innerLeft = padding
			var innerTop = outerTop + (outerOuterRadius - innerOuterRadius)

			//console.log('============ 内环参数 ============')
			//console.log('设备总宽度：' + deviceW)
			//console.log('圆环位置：（' + outerLeft + ', ' + outerTop + '）')
			//console.log('外圆半径：' + outerOuterRadius)
			//console.log('内圆半径：' + outerInnerRadius)
			//console.log('圆环厚度：' + outerThickness)
			//console.log('边框宽度：' + outerThickness)
			//console.log('边框圆角半径：' + innerInnerRadius * 2)

			this.$el.css({
				height: outerTop + outerOuterRadius
			})

			this.drawAnnulus({
				$annulus: this.$inner,
				$rateContainer: this.$innerRateContainer,
				$rateContainerInner: this.$innerRateContainerInner,
				$rate: this.$innerRate,
				$annulusContainer: this.$annulusContainer,
				top: innerTop,
				left: innerLeft,
				innerRadius: innerInnerRadius,
				outerRadius: innerOuterRadius,
				thickness: innerThickness,
				axisX: innerOuterRadius,
				axisY: innerOuterRadius,
				annulusContainerHeight: outerTop + outerOuterRadius
			})

			this.drawAnnulus({
				$annulus: this.$outer,
				$rateContainer: this.$outerRateContainer,
				$rateContainerInner: this.$outerRateContainerOuter,
				$rate: this.$outerRate,
				$annulusContainer: this.$annulusContainer,
				top: outerTop,
				left: innerOuterRadius + padding - outerOuterRadius,
				innerRadius: outerInnerRadius,
				outerRadius: outerOuterRadius,
				thickness: outerThickness,
				axisX: outerOuterRadius,
				axisY: outerOuterRadius,
				annulusContainerHeight: outerTop + outerOuterRadius
			})

			this.posText({
				$text: this.$teamAmount,
				baseTop: outerTop + outerThickness,
				thickness: outerInnerRadius - innerOuterRadius
			})

			this.posText({
				$text: this.$personalCompleteness,
				baseTop: innerTop,
				thickness: innerThickness
			})

			this.calcRadian(deviceW, outerOuterRadius)
		},

		/**
		 * 绘制圆环
		 * @param {Object} args 绘制圆环需要的尺寸参数
		 */
		drawAnnulus: function(args) {
			if (!args) {
				return
			}
			// width -> 内圆半径 * 2
			// height -> 圆环总高度 = 内圆半径 * 2
			// border-width -> 圆环厚度
			// border-radius -> 外圆半径
			args.$annulus.css({
				top: args.top,
				left: args.left,
				width: args.innerRadius * 2,
				height: args.innerRadius * 2,
				borderWidth: args.thickness,
				borderRadius: args.outerRadius
			})

			args.$rateContainer.css({
				top: args.top + 1,
				left: args.left,
				// width: args.outerRadius * 2,
				// height: args.outerRadius
				width: args.outerRadius * 2,
				height: args.outerRadius
			})

			args.$rateContainer[0].style.webkitTransformOrigin = '' + args.axisX + 'px ' + args.axisY + 'px'

			args.$rateContainerInner.css({
				borderRadius: args.outerRadius
			})

			args.$rate.css({
				// width: args.innerRadius * 2,
				// height: args.innerRadius * 2,
				// borderWidth: args.thickness,
				// borderRadius: args.outerRadius
				top: args.outerRadius - args.innerRadius,
				left: args.outerRadius - args.innerRadius,
				width: args.innerRadius * 2,
				height: args.innerRadius * 2,
				borderRadius: args.innerRadius
			})

			args.$annulusContainer.css({
				height: args.annulusContainerHeight
			})
		},

		/**
		 * 定位文字
		 */
		posText: function(args) {
			if (!args) {
				return
			}

			var textHeight = args.$text.height()

			args.$text.css({
				top: (args.thickness - textHeight) / 2 + args.baseTop + 5
			})
		}

	})
})