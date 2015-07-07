module.exports = function(t, e) {
    return function(n) {
        return e[0] + (e[1] - e[0]) * (n - t[0]) / (t[1] - t[0])
    }
};