const path = require('path')
const fs = require('fs')

/**
 * Project paths
 */

const paths = {
  root: path.join(__dirname),
  lib: path.join(__dirname, 'lib'),
  utils: path.join(__dirname, 'lib', 'utils'),
  animations: path.join(__dirname, 'animations')
}

/**
 * CLI args
 */

const minimist = require('minimist')
const minimistOpts = {
  boolean: ['help', 'keys', 'live', 'version'],
  string: ['with'],
  alias: {
    help: ['h'],
    keys: ['k'],
    live: ['l'],
    version: ['v'],
    with: ['w']
  },
  default: {
    keys: false,
    live: false,
    with: null
  }
}

const argv = minimist(process.argv.slice(2), minimistOpts)

if (argv.help) {
  console.log(fs.readFileSync(path.join(paths.root, 'usage.txt'), 'utf-8'))
  process.exit(0)
}

if (argv.version) {
  const pckg = require(path.join(paths.root, 'package.json'))
  console.log(pckg.version)
  process.exit(0)
}

const args = {}
Object.keys(minimistOpts.alias).forEach(key => {
  if (
  argv.hasOwnProperty(key) !== undefined && typeof argv[key] !== 'undefined'
  ) {
    args[key] = argv[key]
  }
})

/**
 * Project config.json, with livereload capability
 */

let config = Object.assign({},
  require(path.join(paths.root, 'stratum.config.json')),
  require(path.join(paths.root, 'stratum.mapping.json')) || {})

if (args.live) {
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

module.exports = { paths, config, args }
