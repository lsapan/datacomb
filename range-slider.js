var n = require("ractive"), r = n.extend({
    template: require("./hbs/range-slider.hbs"),
    data: function() {
        return {
            upper: 3,
            lower: 6,
            upperBound: 10,
            lowerBound: 0,
            step: .2,
            width: 100
        }
    },
    oninit: function() {
        this.observe("upper", function(t) {
            var e = this.get("lower"), n = this.get("step");
            e >= t && this.set("lower", t - n)
        }, {
            init: !1
        }), this.observe("lower", function(t) {
            var e = this.get("upper"), n = this.get("step");
            t >= e && this.set("upper", t + n)
        }, {
            init: !1
        })
    },
    computed: {}
});
module.exports = r;