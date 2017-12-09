const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const dev = process.env.NODE_ENV === 'development'

const srcPath = path.resolve('./src/Frontend')
const assetsPath = path.resolve(srcPath, 'assets')
const jsPath = path.resolve(assetsPath, 'js')
const scssPath = path.resolve(assetsPath, 'scss')
const imgPath = path.resolve(assetsPath, 'img')

const publicPath = path.resolve('./public')
const outputPath = path.resolve(publicPath, 'assets')

let cssLoaders = [
  {loader: 'css-loader', options: {importLoaders: 1, minimize: !dev}}
]

if (!dev) {
  cssLoaders.push({loader: 'postcss-loader'})
}

let config = {
  entry: {
    app: [path.join(jsPath, 'index.js'), path.resolve(scssPath, 'main.scss')]
  },
  output: {
    path: outputPath,
    filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
    publicPath: '/assets/'
  },
  resolve: {
    alias: {
      '@': assetsPath,
      '@js': jsPath,
      '@scss': scssPath,
      '@img': imgPath
    }
  },
  watch: dev,
  devServer: {
    contentBase: publicPath,
    overlay: true,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      },
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
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              limit: 8192
            }
          },
          {
            loader: 'img-loader',
            options: {
              enabled: !dev
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: dev ? '[name].css' : '[name].[contenthash:8].css',
      disable: dev
    }),
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      // Go back one folder because the output dir is assets/
      filename: '../index.html',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin()
  ]
}

if (!dev) {
  config.plugins.push(new CleanWebpackPlugin(['assets'], {
    root: publicPath,
    verbose: true,
    dry: false
  }))
  config.plugins.push(new UglifyJsPlugin({
    sourceMap: true
  }))
}

module.exports = config
