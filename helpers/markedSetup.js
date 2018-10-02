const marked = require("marked");

/**
 * Setup auto highlighting for markdown editor.
 * Sanitizers the input
 * @param {String} val
 * @returns {Object}
 */
module.exports = val => {
  marked.setOptions({
    highlight: function() {
      return require("highlight.js").highlightAuto(val).value;
    },
    sanitize: true
  });
  return marked;
};
