const path = require('path');

module.exports = {
  entry: './src/server.babel.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.min.js'
  },
  mode: 'production',
  devtool: 'source-map',
  target: "node",
  module: {
    exprContextCritical: false
  }
};

