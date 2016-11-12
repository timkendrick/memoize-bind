var memoize = require('memoize-weak');

module.exports = memoize(function bind(fn, context) {
  var args = Array.prototype.slice.call(arguments, 2);
  return Function.prototype.bind.apply(fn, [context].concat(args));
});
