var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.export = {
  devtool: 'cheap-module-source-map',
  entry: '.src/index',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.less/,
        loader: ExtractTextPlugin.extract('style!css!postcss!less'),
        include: path.join(__dirname, 'src')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env' : {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('style.css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.optimize.DedupePlugin(),

  ]
}
