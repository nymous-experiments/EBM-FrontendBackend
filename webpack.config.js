const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const dev = process.env.NODE_ENV === 'development'

const assetsPath = path.resolve('./src/Frontend/assets')
const jsPath = path.resolve('./src/Frontend/assets/js')
const scssPath = path.resolve('./src/Frontend/assets/scss')
const imgPath = path.resolve('./src/Frontend/assets/img')

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
    app: [path.join(jsPath, 'index.js'), path.resolve(scssPath, 'main.scss')]
  },
  output: {
    path: path.resolve('./public/dist'),
    filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
    publicPath: "/dist/"
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
    })
  ]
}

if (!dev) {
  config.plugins.push(new UglifyJsPlugin({
    sourceMap: true
  }))
  config.plugins.push(new CleanWebpackPlugin(['dist'], {
    root: path.resolve('./public'),
    verbose: true,
    dry: false
  }))
  config.plugins.push(new HtmlWebpackPlugin({
    template: path.resolve('./src/Frontend/index.html'),
    // Go back one folder because the output dir is dist/
    filename: '../index.html'
  }))
}

module.exports = config
