'use strict'

const path = require('path')
const { config } = require(path.join(__dirname, '..', 'main.config.js'))

const key = require('midi-keys')
const WebSocket = require('ws')
const ws = new WebSocket(`http://${config.midi.ip}:${config.midi.port}/stratum`, {
  perMessageDeflate: false
})

console.log(`http://${config.midi.ip}:${config.midi.port}/stratum`)

ws.on('error', err => console.log(err))
ws.on('open', () => { ws.alive = true })
ws.on('close', () => {
  // TODO handle reconnection cycle
  ws.alive = false
})

function send (type, note) {
  if (ws.alive) {
    ws.send(JSON.stringify({
      event: 'midi',
      data: { type, ...note }
    }), err => {
      if (err) console.log(err)
    })
  }
}

function createNote (note, velocity) {
  return {
    pitch: (typeof note === 'string' ? key(note) : note) || 1,
    velocity: velocity ? Math.max(0, Math.min(Math.floor(velocity), 127)) : 127
  }
}

module.exports = {
  get open () { return open },

  noteOn: (note, velocity) => send('noteOn', createNote(note, velocity)),
  noteOff: (note, velocity) => send('noteOff', createNote(note, velocity)),
  cc: (number = 0, value = 127) => send('cc', {number, value})
}
