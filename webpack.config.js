const path = require('path')

let config = {
  entry: path.resolve('./src/Frontend/assets/js/index.js'),
  output: {
    path: path.resolve('./public/dist'),
    filename: 'bundle.js'
  },
  watch: true
}

module.exports = config
