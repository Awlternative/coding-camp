// filepath: c:\Ngomding\Dicoding\Coding Camp\pages\notes-app\webpack.dev.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: './dist',
    open: true,
  },
});