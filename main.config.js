const path = require('path')

const paths = {
  root: path.join(__dirname),
  lib: path.join(__dirname, 'lib'),
  utils: path.join(__dirname, 'lib', 'utils'),
  animations: path.join(__dirname, 'animations')
}

const env = process.env.NODE_ENV || 'production'

let config = Object.assign({},
  require(path.join(paths.root, 'stratum.config.json')),
  require(path.join(paths.root, 'stratum.mapping.json')) || {})

if (env === 'development') {
  const chokidar = require('chokidar')
  const fs = require('fs')
  chokidar
    .watch(path.join(paths.root, 'stratum.config.json'))
    .on('change', file => {
      try {
        const newConfig = JSON.parse(fs.readFileSync(file))
        config = Object.assign(config, newConfig)
      } catch (e) {
        console.log(e)
      }
    })
}

module.exports = { paths, config, env }
