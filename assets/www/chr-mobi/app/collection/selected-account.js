define(['backbone', 'zepto', 'model/account', './account', '../../component/autoSave'], function(Backbone, $, Account, Accounts, LocalStorge) {
    var SelectedAccounts = Backbone.Collection.extend({
        model: Account,

        url: function() {
            return '/accounts'
        },

        /*byName: function(options) {
            var myAccount = new Accounts()
            myAccount.byName({
                data: options.data,
                success: function(results) {
                    options.success.apply(this, [results])
                }
            })
        },*/

        getSelectedAccounts: function(options) {
            var account = new Accounts()
            if (LocalStorge.load('selectedAccount')) {
                account = new Accounts(LocalStorge.load('selectedAccount'))
            }
            return options.success.apply(this, [account])
        }
    }, {
        addSelectedAccount: function(account) {
            var selectedAccount = LocalStorge.load('selectedAccount')
            if (!selectedAccount) {
                selectedAccount = [account]
                LocalStorge.save('selectedAccount', selectedAccount)
                return
            }
            selectedAccount = selectedAccount.reverse()

            selectedAccount = selectedAccount.filter(function(item, index) {
                return item.id !== account.id;
            })
            selectedAccount.push(account)
            selectedAccount = selectedAccount.reverse()
            if (selectedAccount.length > 10) {
                selectedAccount.pop()
            }
            LocalStorge.save('selectedAccount', selectedAccount)

        }
    })
    return SelectedAccounts
})