const marked = require("marked");

// set up marked with code highlighting
module.exports = val => {
  marked.setOptions({
    highlight: function() {
      return require("highlight.js").highlightAuto(val).value;
    },
    sanitize: true
  });
  return marked;
};
