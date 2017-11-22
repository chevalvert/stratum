'use strict'

const osc = require('osc')
const path = require('path')
const { args, config, log } = require(path.join(__dirname, '..', 'main.config.js'))

let isOpen = false
const udpPort = new osc.UDPPort({
  // SEE https://github.com/colinbdclark/osc.js/issues/83#issuecomment-290567155
  localAddress: config.sound.udp.local,
  remoteAddress: config.sound.udp.remote,
  remotePort: config.sound.udp.port,
  metadata: true
})

udpPort.on('ready', () => {
  isOpen = true
  log.info('Sound UDP is ready on port ' + config.sound.udp.port)
})

udpPort.on('error', (err) => {
  isOpen = false
  log.error(err)
})

args.sound && udpPort.open()

function findType (value) {
  const isInt = n => n % 1 === 0
  return isInt(value) ? 'i' : 'f'
}

module.exports = {
  send: (address, values = [0]) => {
    if (isOpen) {
      /**
       * message = {
       *   address: '/varName',
       *   args: [
       *     { type: 'i', value: 100 }
       *     { type: 'f', value: 1.0 }
       *   ]
       * }
       */
      values = Array.isArray(values) ? values : [values]
      udpPort.send({
        address,
        args: values.map(value => {
          return { value, type: findType(value) }
        })
      })
    }
  }
}
