const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const dev = process.env.NODE_ENV === 'development'

let cssLoaders = [
  {loader: 'css-loader', options: {importLoaders: 1, minimize: !dev}}
]

if (!dev) {
  cssLoaders.push({
    loader: 'postcss-loader',
    options: {
      plugins: (loader) => [
        require('autoprefixer')(),
      ]
    }
  })
}

let config = {
  entry: {
    app: path.resolve('./src/Frontend/assets/js/index.js')
  },
  output: {
    path: path.resolve('./public/dist'),
    filename: '[name].js',
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
      },
      {
        test: /\.css$/,
        // Loaders are applied from right to left
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssLoaders
        })
      },
      {
        test: /\.scss$/,
        // Loaders are applied from right to left
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...cssLoaders, 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: dev
    })
  ]
}

if (!dev) {
  config.plugins.push(new UglifyJsPlugin({
    sourceMap: true
  }))
}

module.exports = config
