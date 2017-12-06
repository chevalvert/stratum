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
  boolean: [
    'help',
    'keys',
    'leap',
    'reload',
    'sound',
    'timer',
    'version'
  ],
  string: ['with', 'log', 'log-level'],
  alias: {
    help: ['h'],
    keys: ['k'],
    leap: ['l'],
    log: [],
    'log-level': [],
    reload: ['r'],
    sound: ['s'],
    timer: ['t'],
    version: ['v'],
    with: ['w']
  },
  default: {
    leap: false,
    keys: false,
    log: false,
    'log-level': 6,
    reload: false,
    sound: false,
    timer: false,
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
 * Logging system
 */

const Log = require('log')
const stream = args.log
  ? fs.createWriteStream(args.log)
  : null
const logLevel = isNaN(args['log-level'])
  ? args['log-level']
  : parseInt(args['log-level'])
const log = new Log(logLevel, stream)

/**
 * Envfiles
 */

const env = argv._[0] || 'dev'

/**
 * Project config.json, with livereload capability
 */

let config = Object.assign({},
    require(path.join(paths.root, `stratum.config.${env}.json`)),
    require(path.join(paths.root, `stratum.mapping.${env}.json`)) || {})

if (args.reload) {
  const chokidar = require('chokidar')
  const fs = require('fs')
  chokidar
    .watch(path.join(paths.root, `stratum.config.${env}.json`))
    .on('change', file => {
      try {
        const newConfig = JSON.parse(fs.readFileSync(file))
        config = Object.assign(config, newConfig)
      } catch (e) {
        log.error(e)
      }
    })
}

module.exports = { paths, config, args, log, env }
