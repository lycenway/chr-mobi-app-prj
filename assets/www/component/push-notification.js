(function(cordova) {
	var registPlugins;


	function PushNotification() {}

    PushNotification.prototype.getInfo = function(callback, error) {
        cordova.exec(callback, error, "PushNotification", "getInfo", []);
    };

    registPlugins = function () {
		cordova.addConstructor(function() {
	        if (!window.plugins) window.plugins = {};
	        window.plugins.pushNotification = new PushNotification();
	    });
	};    

	document.addEventListener('deviceready', registPlugins , false);    

})(window.cordova || window.Cordova);
