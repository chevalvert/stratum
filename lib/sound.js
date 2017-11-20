'use strict'

const path = require('path')
const dgram = require('dgram')
const { config, log } = require(path.join(__dirname, '..', 'main.config.js'))

let server = dgram.createSocket('udp4')
let isOpen = true
let buf = {}

server.bind(config.sound.udp.port, config.sound.udp.host);

server.on('error', err => {
  log.error(err)
  server.close()
})

server.on('listening', () => {
  const address = server.address()
  log.info(`Sound server is running on (${address.family}) ${address.address}:${address.port}`)
})

server.on('close', () => {
  isOpen = false
  log.info('Closed sound server')
})

function sendBuffer () {
  const string = parsebuffer(buf)
  if (string.length > 0) {
    log.debug('Sound:', string)
    const message = Buffer.from(string)
    server.send(message, config.sound.udp.port, config.sound.udp.host, err => {
      err && log.warning(err)
    })
  }
}

function parsebuffer (buffer) {
  let message = ''
  Object.entries(buffer).forEach(([prefix, value]) => {
    message += `${prefix} ${value} `
  })
  return message
}

function clearBuffer () { buf = {} }

module.exports = {
  buffer: (prefix, value) => {
    buf[prefix.toLowerCase()] = value
  },
  send: () => {
    if (isOpen) {
      sendBuffer()
      clearBuffer()
    }
  }
}
