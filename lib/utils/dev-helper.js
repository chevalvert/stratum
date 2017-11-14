'use strict'

const path = require('path')
const { log } = require(path.join(__dirname, '..', '..', 'main.config.js'))

const defaultOpts = {
  viewer: null,
  onKeyPress: null
}

module.exports = function (opts) {
  opts = Object.assign({}, defaultOpts, opts || {})

  let viewer

  if (opts.viewer) {
    const { spawn } = require('child_process')
    viewer = spawn('processing-java', ['--sketch=' + opts.viewer, '--run'], { detached: true })
    viewer.stdout.on('data', data => log.debug(`[viewer] ${data}`))
    viewer.stderr.on('data', data => log.error(`[viewer] ${data}`))
    viewer.on('close', code => process.exit(code))

    process.on('uncaughtException', err => {
      log.error(err)
      process.kill(-viewer.pid)
      process.exit(1)
    })
  }

  if (opts.onKeyPress) {
    const readline = require('readline')
    readline.emitKeypressEvents(process.stdin)

    process.stdin.setRawMode(true)
    process.stdin.on('keypress', (str, key) => {
      if (key.sequence === '\u0003') {
        process.stdin.pause()
        viewer && process.kill(-viewer.pid)
        process.exit()
      } else if (typeof opts.onKeyPress === 'function') {
        opts.onKeyPress(str, key)
      }
    })
  }
}
