define([
    'forcetk',
    'backbone'
], function (forcetk, Backbone) {
    require(['config-common','config-env'])
	var logToConsole = cordova.require('salesforce/util/logger').logToConsole

    // logToConsole('onDomReady: jquery ready')
	var salesforceSessionRefreshed = function (creds) {
        logToConsole('salesforceSessionRefreshed')
    
        // Depending on how we come into this method, `creds` may be callback data from the auth
        // plugin, or an event fired from the plugin.  The data is different between the two.
        var credsData = creds

        if (creds.data) {
            credsData = creds.data
        }

        ENV.forcetkClient = new forcetk.Client(credsData.clientId, credsData.loginUrl, null, cordova.require("salesforce/plugin/oauth").forcetkRefresh)
        ENV.forcetkClient.setSessionToken(credsData.accessToken, apiVersion, credsData.instanceUrl)
        ENV.forcetkClient.setRefreshToken(credsData.refreshToken)
        ENV.forcetkClient.setUserAgentString(credsData.userAgent)
    }

    var getAuthCredentialsError = function (error) {
        logToConsole('getAuthCredentialsError: ' + error)
    }

    return function () {
        logToConsole('onDeviceReady: Cordova ready')

        var oauth = cordova.require('salesforce/plugin/oauth')

        oauth.getAuthCredentials(salesforceSessionRefreshed, getAuthCredentialsError)
        
        document.addEventListener('salesforceSessionRefresh', salesforceSessionRefreshed, false)
    }
})