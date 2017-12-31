const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const dev = process.env.NODE_ENV === 'development'

// Définit les chemins nécessaires pour la suite de la configuration
const srcPath = path.resolve('./src/Frontend') // Dossier de base pour toutes les sources
const assetsPath = path.resolve(srcPath, 'assets')
const jsPath = path.resolve(assetsPath, 'js')
const scssPath = path.resolve(assetsPath, 'scss')
const imgPath = path.resolve(assetsPath, 'img')
const componentsPath = path.resolve(srcPath, 'components') // Contient les différents composants, comme la navbar ou les articles
const servicesPath = path.resolve(srcPath, 'services') // Contient les services permettant de se connecter à l'API

const publicPath = path.resolve('./public') // Dossier de base de l'output
const outputPath = path.resolve(publicPath, 'assets')

// Le tableau cssLoaders gère les loaders à appliquer aux fichiers CSS et SCSS
let cssLoaders = [
  // css-loader est le loader de base pour que Webpack puisse comprendre les fichiers
  // CSS, et interprète les `import 'style.css'` dans un fichier Javascript
  // Ce loader va compiler tous les scripts définis au cours de l'application en un seul
  // fichier, et les minifier si webpack tourne en mode production
  {loader: 'css-loader', options: {importLoaders: 1, minimize: !dev}}
]

if (!dev) {
  // Si on est en mode production, on ajoute le postcss-loader
  // Ce loader sert à transformer le CSS une fois compilé depuis le SCSS, par exemple
  // en ajoutant les préfixes vendeurs uniquement aux propriétés qui le nécessitent.
  // Il est configuré dans le fichier postcss.config.js
  cssLoaders.push({loader: 'postcss-loader'})
}

let config = {
  entry: {
    // Le point d'entrée de notre application, on indique ici le fichier JS et
    // le fichier SCSS
    app: [path.join(jsPath, 'index.js'), path.resolve(scssPath, 'main.scss')]
  },
  output: {
    // Où placer les fichiers générés
    path: outputPath,
    // Le nom du fichier JS à créer. Ce sera dans notre cas le nom du point d'entrée
    // (ici `app`), et dans le cas du mode production on ajoute un hash à la fin
    // du nom du fichier, pour éviter les problèmes liés au cache du navigateur
    // (si on fait une modification sur un fichier, il aura forcément un nom différent
    // et sera donc retéléchargé)
    filename: dev ? '[name].js' : '[name].[chunkhash:8].js',
    // Le chemin qui sera utilisé pour charger les assets. Il sera appliqué dans
    // le CSS par exemple, pour remplacer le chemin vers la police, ou les images
    publicPath: '/assets/'
  },
  resolve: {
    // Cet objet définit des alias utilisés dans les fichier JS, pour écrire des
    // import plus simplement (on peut `import '@js/main.js'` plutôt que de devoir
    // remonter le chemin en relatif avec `import '../../../js/main.js'`)
    alias: {
      '@': assetsPath,
      '@js': jsPath,
      '@scss': scssPath,
      '@img': imgPath,
      '@components': componentsPath,
      '@services': servicesPath
    }
  },
  // On indique à Webpack de surveiller les fichiers en mode de développement,
  // et de relancer une compilation quand ils sont modifiés
  watch: dev,
  // Le devServer permet à Webpack de fonctionner comme un serveur Web, et de
  // servir les assets directement depuis la RAM et avec un rechargement automatique
  // pour les assets supportés. Par exemple, le CSS est chargé dans une balise
  // <style>, qui est retirée et replacée à chaque modification, ce qui permet de
  // voir le résultat sans recharger la page.
  // Pour certains frameworks (comme Angular, React ou Vue), il est même possible
  // de faire des modifications du JS sans recharger entièrement la page, mais juste
  // en intégrant les modifications les plus récentes. Toutefois dans notre cas,
  // comme la configuration est faite à la main, Webpack va recharger la page à
  // chaque modification des JS.
  devServer: {
    // Le dossier que doit servir le devServer
    contentBase: publicPath,
    // Le devServer affiche un overlay sur toute la page en cas d'erreur de compilation,
    // indiquant l'emplacement incriminé, afin de faciliter le débuggage
    overlay: true,
    // On proxy les requêtes vers les URL commençant par /api vers le serveur
    // PHP qui tourne en interne sur le port 8000 (si lancé avec la commande dans
    // le README)
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  // Si on est en mode de développement, créer des source-maps directement dans
  // le fichier JS ou CSS généré. Ces source-maps permettent de faire la traduction
  // entre un emplacement dans le fichier compilé (qui est la concaténation de tous
  // les assets) et les fichiers sources, pour facilité le débuggage. Par exemple,
  // la ligne 1127 du fichier bundle.js correspond à la ligne 14 du fichier article.js.
  // En mode production, on extrait ces source-maps dans des fichiers séparés, pour
  // réduire la taille des fichiers générés.
  devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',
  // On définit ici tous les loaders qui s'appliqueront à nos sources
  module: {
    rules: [
      {
        // Cette règle s'applique forcément avant le traitement de tous les fichiers
        // .js, grâce à la règle `enforce: pre`
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        // On vérifie la syntaxe des fichiers Javascript grâce à ESLint
        use: ['eslint-loader']
      },
      {
        // Tous les fichiers Javascript sont transpilés par Babel.
        // La configuration est faite dans le fichier .babelrc
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        // Les fichiers .hbs doivent être interprétés par Handlebars
        test: /\.hbs$/,
        use: ['handlebars-loader']
      },
      {
        test: /\.css$/,
        // On extrait les styles CSS (appliqués dans une balise <style> en mode
        // de développement) dans des fichiers à part, en les interprétant grâce
        // aux cssLoaders définis plus haut
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssLoaders
        })
      },
      {
        test: /\.scss$/,
        // Pour les fichiers SCSS, on applique en plus le sass-loader.
        // Les loaders sont appliqués de la droite vers la gauche.
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...cssLoaders, 'sass-loader']
        })
      },
      {
        // Les polices sont simplement recopiées comme des fichiers
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader'
      },
      {
        // Les images sont optimisées par le img-loader (sauf en mode développement),
        // et si elles sont assez petites elles sont intégrées directement en base64.
        // Sinon, le fichier créé possède aussi un hash pour traverser le cache du
        // navigateur.
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
    // On désactive l'extraction du CSS dans un fichier à part en mode développement,
    // pour profiter du rechargement à chaud du style.
    new ExtractTextPlugin({
      filename: dev ? '[name].css' : '[name].[contenthash:8].css',
      disable: dev
    }),
    // Ce plugin permet, à partir d'un template HTML de base, d'insérer les liens
    // vers les fichiers CSS et JS générés. Comme leur nom change à chaque modification,
    // il est impossible de charger simplement <script src="bundle.js">. Ce plugin
    // insère automatiquement <script src="bundle.fb2e88g.js">.
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.hbs'),
      // Go back one folder because the output dir is assets/
      filename: '../index.html',
      alwaysWriteToDisk: true
    }),
    // Ce plugin force le HtmlWebpackPlugin à créer le fichier, même si on utilise
    // le devServer (qui ne peut servir que les assets et pas le fichier htML).
    new HtmlWebpackHarddiskPlugin(),
    // Ce plugin génère automatiquement les icônes nécessaires pour les favicons,
    // les raccourcis Android, iOS, et ce dans les différentes résolutions.
    new FaviconsWebpackPlugin(path.join(imgPath, 'paragraph.svg'))
  ]
}

if (dev) {
  // En mode de développement, on nomme les différents modules chargés, pour un
  // affichage plus clair dans la console de chaque modification (cela affiche
  // "module app reloaded", plutôt que "module 0 reloaded")
  config.plugins.push(new webpack.NamedModulesPlugin())
} else {
  // En mode de production, on nettoie le dossier où sont générés les fichiers
  // avant chaque compilation
  config.plugins.push(new CleanWebpackPlugin(['assets'], {
    root: publicPath,
    verbose: true,
    dry: false
  }))
  // En mode de production, on compresse les sources (JS et CSS)
  config.plugins.push(new UglifyJsPlugin({
    sourceMap: true
  }))
}

module.exports = config
