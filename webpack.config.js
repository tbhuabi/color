const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ip = require('ip');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    index: path.resolve(__dirname, 'public-api.ts')
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@tanbo/color': path.resolve('src/public-api.ts'),
      '@tanbo/': path.resolve('src'),
    }
  },
  devServer: {
    host: ip.address(),
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9006,
    hot: true,
    open: true,
    disableHostCheck: true
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: ['ts-loader']
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html'
    })
  ]
};
