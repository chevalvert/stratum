'use strict'

const osc = require('osc')
const path = require('path')
const { args, config, log } = require(path.join(__dirname, '..', 'main.config.js'))

let isOpen = false
let udpPort
let reconnectionAttempts = 0

args.sound && reconnect()

function reconnect () {
  udpPort && close()

  udpPort = new osc.UDPPort({
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

  udpPort.on('close', (data) => {
    isOpen = false
    log.info('Sound UDP has been closed')
  })

  udpPort.on('error', (err) => {
    if (err) {
      isOpen = false
      log.error(err)
      if (reconnectionAttempts < config.sound.udp.reconnection.attempts) {
        if (err.code === 'EHOSTUNREACH' || err.code === 'EHOSTDOWN') {
          setTimeout(() => {
            log.info('Trying to reconnect sound UDP...')
            reconnectionAttempts++
            reconnect()
          }, config.sound.udp.reconnection.delay)
        }
      }
    }
  })

  udpPort.open()
}

function close () {
  udpPort && udpPort.close()
}

function findType (value) {
  const isInt = n => n % 1 === 0
  return isInt(value) ? 'i' : 'f'
}

module.exports = {
  enabled: (args.sound === true),
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
          const type = findType(value)
          if (type === 'f') value = value.toFixed(config.sound.floatDecimals)
          return { value, type }
        })
      })
    }
  }
}
