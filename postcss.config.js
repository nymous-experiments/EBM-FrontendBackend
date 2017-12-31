module.exports = {
  plugins: (loader) => [
    // autoprefixer va rajouter aux propriétés CSS les préfixes vendeurs,
    // par exemple -webkit- ou -moz-.
    // Il effectue cette transformation uniquement sur les propriétés qui le
    // nécessitent, en utilisant les données de https://caniuse.com/, et le tableau
    // de compatibilité des navigateurs défini dans le fichier package.json par
    // la clé `browserslist` (dans notre cas, browserslist = ["last 2 versions",
    // "ie >= 11", "Firefox ESR"])
    require('autoprefixer')()
  ]
}
