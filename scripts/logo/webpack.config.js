const path = require('path');

let p = path.resolve('../../content/scripts/logo/')
console.log(p)
module.exports = {
	  entry: './src/index.js',
	  mode: "production",
	  output: {
		      path: p,
		      filename: 'bundle.js',
		    },
};

