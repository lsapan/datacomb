var _ = require('lodash');
var n = require("ractive");
var r = require("./linear-scale");
var i = _.max;
var o = n.extend({
    template: require("./hbs/bar-chart.hbs"),
    data: function() {
        return {
            height: 100,
            width: 100,
            pad: {
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
                bar: 0
            },
            bars: [],
            accessor: function(t) {
                return t
            }
        }
    },
    computed: {
        innerHeight: "${height} - ${pad.top} - ${pad.bottom}",
        innerWidth: "${width} - ${pad.right} - ${pad.left}",
        barHeights: function() {
            console.log("calcing heights...");
            var t = this.get("bars").map(this.get("accessor")), e = this.get("innerHeight"), n = 0, o = i(t);
            return t && t.length ? t.map(r([n, o], [0, e])) : []
        }
    }
});
module.exports = o;