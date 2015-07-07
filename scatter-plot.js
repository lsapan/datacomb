var _ = require('lodash');
var n = require("ractive"), r = require("./linear-scale"), i = _.max, o = _.min, a = n.extend({
    template: require("./hbs/scatter-plot.hbs"),
    data: function() {
        return {
            height: 100,
            width: 100,
            pad: {
                top: 10,
                right: 10,
                left: 10,
                bottom: 10
            },
            points: [],
            xAccessor: function(t) {
                return t.x
            },
            yAccessor: function(t) {
                return t.y
            },
            xScale: function() {
                return 0
            },
            yScale: function() {
                return 0
            },
            xBounds: [0, 1],
            yBounds: [0, 1]
        }
    },
    oninit: function() {
        this.observe("xAccessor", function(t) {
            if (t) {
                var e = this.get("points"), n = e.map(t), a = o(n), s = i(n), u = this.get("innerWidth");
                this.set({
                    xBounds: [a, s],
                    xScale: r([a, s], [0, u])
                })
            }
        }), this.observe("yAccessor", function(t) {
            if (t) {
                var e = this.get("points"), n = e.map(t), a = o(n), s = i(n), u = this.get("innerHeight");
                this.set({
                    yBounds: [a, s],
                    yScale: r([a, s], [u, 0])
                })
            }
        })
    },
    computed: {
        innerHeight: "${height} - ${pad.top} - ${pad.bottom}",
        innerWidth: "${width} - ${pad.right} - ${pad.left}"
    }
});
module.exports = a;