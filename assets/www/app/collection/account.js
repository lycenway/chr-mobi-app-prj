define(['backbone', 'model/account','./selected-account','../../component/autoSave'], function (Backbone, Account, SelectedAccounts, LocalStorge) {
    var Accounts = Backbone.Collection.extend({
        model: Account,

        url: function () {
            return '/accounts'
        },

        byName: function(options){
            var self = this
            if(!options.data.keyword){
                self.getSelectedAccounts(options)
            }
            else{
                this.getMyAccounts({
                    success: function (results) {
                    	/*var result = []
                    	var secondResult = []
                    	_.filter(result,function(a){
                    		var index = a.get('name').indexOf(options.data.keyword)
                    		if(a==0){
                    			result.push(a)
                    		}
                    		else if(a>0){
                    			secondResult.push(a)
                    		}
                    	})
                    	if(result.length < 10){
                    		result.push(_.first(secondResult,10-result.length))
                    	}*/
                        var result = results.filter(function(a){
                            return a.get('name').indexOf(options.data.keyword) == 0
                        })
                        if(result.length < 10){
                            var secondResult = results.filter(function(a){
                                return a.get('name').indexOf(options.data.keyword) > 0
                            })
                    		result = result.concat(_.first(secondResult,10-result.length))
                    	}

                        options.success.apply(this, [new Accounts(result)])
                    }
                })
            }
        },

        getMyAccounts: function(options){
            this.fetch({
                _cache: {
                    key: '/myaccount',
                },
                success: function (results) {
                    options.success.apply(this, arguments)
                },

                error: function() {
                    console.error('error get shops ')
                }
            })
        },

        getSelectedAccounts: function(options) {
            var result = []
            if (LocalStorge.load('selectedAccount')) {
                result = LocalStorge.load('selectedAccount')
            }
            options.success.apply(this, [new Accounts(result)])
        },

        save: function(id,name){
            App.visit.get('account').set({
                id:id,
                name:name
            })
        }
    })
    return Accounts
})