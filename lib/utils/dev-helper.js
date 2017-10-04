'use strict'

const defaultOpts = {
  viewer: null
}

module.exports = function (opts) {
  opts = Object.assign({}, defaultOpts, opts || {})

  if (opts.viewer) {
    const { spawn } = require('child_process')
    const viewer = spawn('processing-java', ['--sketch=' + opts.viewer, '--run'])

    viewer.stdout.on('data', (data) => console.log(`[viewer] ${data}`))
    viewer.stderr.on('data', (data) => console.log(`[viewer] err: ${data}`))
    viewer.on('close', (code) => process.exit(code))

    process.on('uncaughtException', err => {
      console.log(err)
      viewer.kill('SIGINT')
      process.exit(1)
    })
  }
}
