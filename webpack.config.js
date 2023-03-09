const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const config = {
  devtool: 'source-map',
  entry: {
    background: './src/background.js',
    contentScript: './src/contentScript.js',
    popup: './src/popup.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [new CleanWebpackPlugin()]
}

module.exports = config
