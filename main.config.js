const path = require('path')

const paths = {
  root: path.join(__dirname),
  lib: path.join(__dirname, 'lib'),
  utils: path.join(__dirname, 'lib', 'utils'),
  animations: path.join(__dirname, 'animations')
}

const env = process.env.NODE_ENV || 'production'

module.exports = { paths, env }
