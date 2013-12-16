define([], function() {

    /**
     * search the CSSOM for a specific -webkit-keyframe rule
     * @param  {String} rule -webkit-animation-name
     * @return {Keyframe} -webkit-keyframe rule
     */

    function findKeyframesRule(rule) {
        // gather all stylesheets into an array
        var ss = document.styleSheets

        // loop through the stylesheets
        for (var i = 0; i < ss.length; ++i) {

            // loop through all the rules
            for (var j = 0; j < ss[i].cssRules.length; ++j) {
                // find the -webkit-keyframe rule whose name matches our passed over parameter and return that rule
                if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == rule) return ss[i].cssRules[j]
            }
        }

        // rule not found
        return null
    }

    function emptyKeyFrames(keyframes) {
        if (!keyframes) {
            return
        }

        var keys = _.map(keyframes.cssRules, function (cssRule) {
            return cssRule.keyText
        })

        _.each(keys, function (key) {
            keyframes.deleteRule(key)
        })
    }

    function insertRule(keyframes, keyText, cssText) {
        keyframes.insertRule(keyText + ' ' + cssText)
    }

    function changeKeyFrames(anim, rotateDeg) {
        var keyframes = findKeyframesRule(anim)

        emptyKeyFrames(keyframes)

        insertRule(keyframes, '0%', '{-webkit-transform: rotate(-180deg);}')

        // if (rotateDeg < -40 - 10) {
        //     insertRule(keyframes, '50%', '{-webkit-transform: rotate(-40deg);}')    
        // }

        insertRule(keyframes, '100%', '{-webkit-transform: rotate(' + rotateDeg + 'deg);}')
    }

    return {
        changeKeyFrames: changeKeyFrames
    }

})