const path = require('path');

const BUILD_DIR = path.resolve(__dirname, './client/build');
const APP_DIR = path.resolve(__dirname, './client/src');

const config = {
  entry: `${APP_DIR}/index.jsx`,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
   node: {
    fs: 'empty',
    net: 'empty',
    module: 'empty'
  }
};

module.exports = config;