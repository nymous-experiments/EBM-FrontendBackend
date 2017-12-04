const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const dev = process.env.NODE_ENV === 'development'

let config = {
  entry: path.resolve('./src/Frontend/assets/js/index.js'),
  output: {
    path: path.resolve('./public/dist'),
    filename: 'bundle.js',
    publicPath: "/dist/"
  },
  watch: dev,
  devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: []
}

if (!dev) {
  config.plugins.push(new UglifyJsPlugin({
    sourceMap: true
  }))
}

module.exports = config
