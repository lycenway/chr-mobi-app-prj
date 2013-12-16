// requirejs 配置
requirejs.config({
	deps: ['main'],
	paths: {
		vendor: '../vendor',
		component: '../component',
		module: './module'
	},

	packages: [
		{
			name: 'fastclick',
			location: '../vendor/fastclick',
			main: 'fastclick.js'
		},{
			name: 'backbone',
			location: '../vendor/backbone',
			main: 'backbone-1.0.0.js'
		}, {
			name: 'zepto',
			location: '../vendor/zepto',
			main: 'zepto.js'
		}, {
			name: 'underscore',
			location: '../vendor/lodash',
			main: 'lodash.underscore.min.js'
		}, {
			name: 'underscore.string',
			location: '../vendor/underscore.string',
			main: 'underscore.string.min.js'
		}, {
			name: 'iscroll',
			location: '../vendor/iscroll',
			main: 'iscroll.js'
		}, {
			name: 'forcetk',
			location: '../salesforce',
			main:　'forcetk.mobilesdk.js'
		}, {
			name: 'subroute',
			location: '../vendor/backbone.subroute',
			main: 'backbone.subroute.js'
		}, {
			name: 'relational',
			location: '../vendor/backbone.relational',
			main: 'backbone.relational.js'
		}, {
			name: 'domReady',
			location: '../vendor/requirejs/plugin',
			main: 'dom-ready.js'
		}, {
			name: 'config-common',
			location: 'config',
			main: 'common.js'
		}, {
			name: 'config-env',
			location: 'config',
			main: 'env.js'
		}
	],

	shim: {
		backbone: {
			deps: ['zepto', 'underscore'],
			exports: 'Backbone'
		},
		zepto: {
			exports: '$'
		},
		iscroll: {
			exports: 'iScroll'
		},
		underscore: {
			exports: '_'
		},
		forcetk: {
			deps: ['zepto'],
			exports: 'forcetk'
		},
		subroute: {
			deps: ['backbone']
		},
		'underscore.string': {
			exports: '_s'
		},
		relational: {
			deps: ['backbone']
		}
	}
})