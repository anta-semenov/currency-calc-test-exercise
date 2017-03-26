var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:3007',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: {
      '_styleVariables.less': path.resolve('./src/constants/styleVariables.less')
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src')
    },
    {
      test: /\.less$/,
      loader: 'style-loader!css-loader!postcss-loader!less-loader',
      include: path.join(__dirname, 'src')
    }],
    postcss: function () {
      return [require('autoprefixer')];
    }
  }
};
