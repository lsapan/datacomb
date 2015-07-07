var _ = require('lodash');
var n = require("ractive");
var r = require("jStat").jStat;
var i = _.uniq;
var o = _.all;
var a = _.zipObject;
var s = _.sortByOrder;
var u = _.isString;
var c = _.extend;
var l = _.map;
var h = _.min;
var f = _.max;
var d = require("./palette").fancy;
var p = require("./bar-chart");
var m = require("./scatter-plot");
var g = require("./range-slider");
var v = function(t, e) {
    this.set("rows.*.hovered", !1), this.set("rows." + e + ".hovered", !0)
}, b = function(t, e, n) {
    var r = this.get("rows"), i = this.get("groupByNdx"), o =- 1 != i ? s(r, ["values." + i, "values." + e], [!0, "asc" !== n]) : s(r, ["values." + e], ["asc" !== n]);
    o.forEach(function(t, e) {
        t.ndx = e
    }), this.set({
        sort: {
            dir: n,
            colNdx: e
        },
        rows: o
    })
}, y = function(t, e) {
    this.toggle("rows." + e + ".focused")
}, w = function(t, e) {
    var n = this.get("rows").filter(function(t) {
        return t.values[e.colNdx] >= e.binMin && t.values[e.colNdx] <= e.binMax
    }).map(function(t) {
        return ["rows." + t.ndx + ".focused", !0]
    });
    this.set(a(n))
}, x = function(t, e) {
    this.set("rows.*.hovered", !1);
    var n = this.get("rows").filter(function(t) {
        return t.values[e.colNdx] >= e.binMin && t.values[e.colNdx] <= e.binMax
    }).map(function(t) {
        return ["rows." + t.ndx + ".hovered", !0]
    });
    this.set(a(n))
}, k = function(t, e) {
    this.set({
        isDragging: !0,
        initialDrag: e
    })
}, E = function(t, e) {
    this.set("isDragging", !1);
    for (var n = this.get("initialDrag"); e > n; n++)
        this.set("rows." + n + ".focused", !0)
}, A = function(t) {
    this.get("isDragging") && this.set(t.keypath + ".focused", !0)
};

var DataComb = n.extend({
    template: require("./hbs/data-comb.hbs"),
    components: {
        HistogramChart: p.extend({
            data: function() {
                return {
                    pad: {
                        top: 10,
                        right: 0,
                        left: 0,
                        bottom: 0
                    },
                    accessor: function(t) {
                        return t.count
                    }
                }
            }
        }),
        ScatterPlot: m.extend({
            data: function() {
                return {
                    pad: {
                        top: 10,
                        right: 0,
                        left: 0,
                        bottom: 0
                    }
                }
            }
        }),
        RangeSlider: g
    },
    data: function() {
        return {
            histogramBins: 20,
            labelAccessor: function(t, e) {
                return "#" + e
            },
            globalColorNdx: - 1,
            groupByNdx: - 1,
            detailColNdx: - 1,
            filters: [],
            correlationForCols: function(t, e) {
                var n = this.get("rows");
                return r.corrcoeff(l(n, "values." + t), l(n, "values." + e))
            },
            focusOnHover: !0,
            hideUnfocused: !1,
            showHistogram: !1,
            showSummary: !1,
            showFilter: !1
        }
    },
    oninit: function() {
        console.log("init'd"), this.on("hoverRow", v), this.on("ScatterPlot.hoverRow", v), this.on("focusRow", y), this.on("ScatterPlot.focusRow", y), this.on("colSort", b), this.on("dragStart", k), this.on("dragOver", A), this.on("dragEnd", E), this.on("HistogramChart.barMouseover", x), this.on("HistogramChart.barClick", w), this.observe("groupByNdx", function(t) {
            var e = this.get("rows"), n = this.get("sort.colNdx"), r = this.get("sort.dir"), i =- 1 != t ? s(e, ["values." + t, "values." + n], [!0, "asc" !== r]) : s(e, ["values." + n], [!0]);
            i.forEach(function(t, e) {
                t.ndx = e
            }), this.set("rows", i)
        }), this.observe("dataset", function() {
            var t = this.get("dataset"), e = this.get("columns"), n = this.get("labelAccessor");
            this.set("rows", t.map(function(t, r) {
                var i = {
                    ndx: r,
                    focused: !1,
                    hovered: !1,
                    filtered: !1,
                    label: u(n) ? t[n]: n(t, r),
                    values: [],
                    labels: [],
                    raw: [],
                    widths: []
                };
                return e.forEach(function(e, n) {
                    var r = i.values[n] = u(e.accessor) ? t[e.accessor]: e.accessor(t);
                    i.labels[n] = e.format ? e.format(r) : r, "discrete" === e.type || (i.widths[n] = e.widthFn(r))
                }), c(t, i)
            })), this.set("filters", e.map(function(t) {
                return "discrete" == t.type ? a(t.uniqValues.map(function(t) {
                    return [t, !0]
                })) : {
                    max: t.maxValue,
                    min: t.minValue
                }
            }))
        }), this.observe("detailColNdx", function(t) {
            if ( - 1 === t)
                return {};
            var e = {}, n = this.get("rows"), i = this.get("discreteColumns"), o = this.get("columns." + t);
            i.forEach(function(t) {
                e[t.ndx] = a(t.uniqValues.map(function(e) {
                    return [e, r.mean(n.filter(function(n) {
                        return n.values[t.ndx] == e
                    }).map(function(t) {
                        return t.values[o.ndx]
                    }))]
                }))
            }), this.set("detailAverages", e)
        }), this.observe("filters", function(t) {
            var e = function(e) {
                return o(t, function(t, n) {
                    return t.max ? e.values[n] >= t.min && e.values[n] <= t.max : t[e.values[n]]
                })
            }, n = {};
            this.get("rows").forEach(function(t) {
                n["rows." + t.ndx + ".filtered"]=!e(t)
            }), this.set(n)
        })
    },
    computed: {
        columns: function() {
            var t = this.get("colDefs"), e = this.get("dataset"), n = this.get("histogramBins");
            return t.map(function(t, o) {
                var s = l(e, t.accessor);
                if ("discrete" == t.type) {
                    var u = i(s).sort(), p = u.map(function(t, e) {
                        return [t, d[e%d.length]]
                    });
                    return c(t, {
                        ndx: o,
                        colorMap: a(p),
                        uniqValues: u
                    })
                }
                var m = h(s), g = f(s);
                return c(t, {
                    ndx: o,
                    valAccessor: function(t) {
                        return t.values[o]
                    },
                    minValue: m,
                    maxValue: g,
                    minFilter: m,
                    maxFilter: g,
                    mean: r.mean(s),
                    median: r.median(s),
                    histogram: r.histogram(s, n).map(function(t, e) {
                        return {
                            count: t,
                            colNdx: o,
                            binMin: e / n * (g - m),
                            binMax: (e + 1) / n * (g - m)
                        }
                    }),
                    widthFn: function(t) {
                        return (t - m) / (g - m) * 100
                    }
                })
            })
        },
        discreteColumns: function() {
            var t = this.get("columns");
            return t.filter(function(t) {
                return "discrete" === t.type
            })
        },
        continuousColumns: function() {
            var t = this.get("columns");
            return t.filter(function(t) {
                return "discrete" !== t.type
            })
        },
        detailCol: function() {
            var t = this.get("columns"), e = this.get("detailColNdx");
            return - 1 !== e ? t[e] : null
        }
    },
    onrender: function() {
        var t = this;
        setTimeout(function() {
            var e = document.querySelector(".tc-header-controls").offsetHeight + "px", n = document.querySelectorAll("table.data-comb th div");
            Array.prototype.forEach.call(n, function(t) {
                t.style.top = e
            });
            var r = document.querySelectorAll("tbody tr:nth-of-type(3) td"), i = t.get("colDefs");
            i.forEach(function(t, e) {
                t.pxWidth = r[e + 1].offsetWidth
            }), t.set("colDefs", i)
        }, 500)
    }
});

module.exports = DataComb;
