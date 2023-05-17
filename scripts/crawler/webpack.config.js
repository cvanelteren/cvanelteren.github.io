const path = require('path');

let p = path.resolve('../../content/scripts/crawler/')
console.log(p)
module.exports = {
  entry: './src/graph.js',
  mode: "production",
  output: {
    path: p,
    filename: 'bundle.js',
  },
};
