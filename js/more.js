String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
let assert = function(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
};
