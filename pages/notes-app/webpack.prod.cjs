// filepath: c:\Ngomding\Dicoding\Coding Camp\pages\notes-app\webpack.prod.js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
});