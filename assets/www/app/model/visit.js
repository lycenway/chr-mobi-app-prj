define(['backbone',
    '../../component/date',
    '../../component/mile',
    'zepto',
    '../collection/visit-business-type',
    '../collection/visit-case-type',
    '../collection/visitStage',
    '../collection/marketingTool',
    '../collection/visitIssue',
    './account',
    './case-mile',
    './visitPartner'
], function(Backbone, DateUtil, MileUtil, $, VisitBusinessTypeCollection, VisitCaseTypeCollection, VisitStageCollection, MarketingToolCollection, VisitIssueCollection, Account, CaseMile, VisitPartner) {
    return Backbone.Model.extend({
        url: function() {
            var url = '/visit'
            if (this.get('id') != null) {
                url += '/' + this.get('id')
            }
            return url
        },

        idAttribute: '_id',

        setMarketingTools: function(value, selected) {
            var list
            if (this.get('marketingTools')) {
                list = this.get('marketingTools').split(';')
            } else {
                list = []
            }

            if ($.inArray(value, list) > -1) {
                list.splice($.inArray(value, list), 1)
            }

            if (!selected) {
                list.push(value)
            }

            this.set('marketingTools', list.join(';'))
        },

        setVisitIssue: function(value, selected) {
            var list
            if (this.get('visitIssue')) {
                list = this.get('visitIssue').split(';')
            } else {
                list = []
            }

            if ($.inArray(value, list) > -1) {
                list.splice($.inArray(value, list), 1)
            }

            if (!selected) {
                list.push(value)
            }

            this.set('visitIssue', list.join(';'))
        },

        setCaseType: function(value) {
            if (value != this.get('caseType')) {
                this.set('caseType', value)
                this.set('businessType','')                
            }
        },

        setBusinessType: function(value, selected) {
            var list
            if (this.get('businessType')) {
                list = this.get('businessType').split(';')
            } else {
                list = []
            }

            if ($.inArray(value, list) > -1) {
                list.splice($.inArray(value, list), 1)
            }

            if (selected) {
                list.push(value)
            }

            this.set('businessType', list.join(';'))
        },

        setPartner: function(partner){
            partner.selected = !partner.selected
            this.set('partner', partner)
        },

        setCasePicture: function(img) {
            this.set('casePicture', img)
        },

        toViewJSON: function() {
            var data = this.toJSON()

            console.log('Visit before: ' + JSON.stringify(data))

            if(data.visitDate && data.visitDate != '') {
                data.visitDate = DateUtil.formateStdString(new Date(data.visitDate))
            }

            var caseType = data.caseType
            data.caseType = new VisitCaseTypeCollection().fetch()
            this.convertToArray(caseType, data.caseType)
            console.log('caseType ', caseType)

            console.log('businessType 1', data.businessType)
            data.businessType = (new VisitBusinessTypeCollection()).getSelected(data.businessType, caseType)
            console.log('businessType 2', data.businessType)

            var stage = data.stage
            data.stage = new VisitStageCollection().fetch()
            this.convertToArray(stage, data.stage)

            var marketingTools = data.marketingTools
            data.marketingTools = new MarketingToolCollection().fetch()
            this.convertToArray(marketingTools, data.marketingTools)

            var visitIssue = data.visitIssue
            data.visitIssue = new VisitIssueCollection().fetch()
            this.convertToArray(visitIssue, data.visitIssue)

            console.log('Visit after: ' + JSON.stringify(data))

            return data
        },

        convertToArray: function(value, array) {
            if (!value) {
                value = ''
            }
            var list = value.split(';')

            $.each(array, function(index, item) {
                if ($.inArray(item.name, list) > -1) {
                    item.selected = true
                }
            })
        },

        validate: function() {
            if (!this.get('account').id || this.get('account').id == '') {
                return '请选择线|段|起止！'
            }
            // if (this.get('visitDate') == '') {
            //     return '请填写采集日期！'
            // }
            // if (new Date(this.get('visitDate')).getTime() > new Date().getTime()) {
            //     return '采集日期不能为将来的日期！'
            // }
            if (this.get('stage') == '') {
                return '请填写病害程度！'
            }
            if (this.get('businessType') == '') {
                return '请填写病害类型！'
            }
        },

        save: function(attributes, options){
            if(this.validate()){
                alert(this.validate())
                return
            }
            if(this.get('partner') && !this.get('partner').selected){
                this.set('partner', {})
            }
            else{
                console.log('partner null')
            }
            console.log('case ', this, attributes, options)
            return Backbone.Model.prototype.save.call(this, attributes, options)
        },

        defaults: function() {
            return {
                account: {},
                caseMile: {num: '256.128', kiloShow: MileUtil.formatMile(256.128)},
                id: null,
                stage: '',
                description: '',
                visitDate: DateUtil.formateStdString(new Date()),
                businessType: '',
                caseType: '',
                partner: {},
                marketingTools: '',
                visitIssue: '',
                casePicture: ''
            }
        }
    })
})
