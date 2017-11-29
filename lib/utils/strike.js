'use strict'

const path = require('path')
const { paths } = require(path.join(__dirname, '..', '..', 'main.config.js'))

const defaultOpts = {
  position: null,
  target: null,
  lifetime: 10, // in seconds
  color: [255, 255, 255]
}

function randomPosition ({ width, depth }) {
  return {
    x: Math.floor(Math.random() * width - 1),
    y: Math.floor(Math.random() * depth - 1)
  }
}

module.exports = class Strike {
  constructor (context, opts) {
    this.context = context
    this.opts = Object.assign({}, defaultOpts, opts || {})

    this.position = this.opts.position || randomPosition(this.context)
    this.target = this.opts.target || randomPosition(this.context)

    this.start = this.context.count
    this.end = this.start + opts.lifetime
  }

  get x () { return this.position.x }
  set x (x) { this.position.x = x }

  get y () { return this.position.y }
  set y (y) { this.position.y = y }

  get isDead () { return this.context.count > this.end }

  update () {
    // Random walk to strike target, one direction at the time
    const randOffset = Math.random() >= 0.5 ? -1 : 1
    const dirX = Math.sign(this.target.x - this.x) || randOffset
    const dirY = Math.sign(this.target.y - this.y) || randOffset
    if (Math.random() >= 0.5) this.x += dirX
    else this.y += dirY

    // Target is reassigned when reached
    if (this.x === this.target.x && this.y === this.target.y) {
      this.target = randomPosition(this.context)
    }
  }

  draw (color = null) {
    for (let z = 0; z < this.context.height; z++) {
      this.context.set(this.x, this.y, z, color || this.opts.color)
    }
  }
}
