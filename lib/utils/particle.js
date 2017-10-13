'use strict'

const path = require('path')
const { paths } = require(path.join(__dirname, '..', '..', 'main.config.js'))
const { Vec3 } = require('vec23')
const { width, height, depth } = require(path.join(paths.lib, 'stratum'))

const defaultOpts = {
  velocity: new Vec3(0, 0, 0),
  acceleration: new Vec3(0, 0, 0),
  maxSpeed: 1,
  trailLength: 3,
  trailPitch: 1,
}

module.exports = class Particle {
  constructor (x, y, z, opts) {
    this.opts = Object.assign({}, defaultOpts, opts || {})

    this.position = new Vec3(x, y, z)
    this.pposition = this.position.clone()
    this.velocity = this.opts.velocity
    this.acceleration = this.opts.acceleration
    this.trail = []
  }

  update () {
    if (distanceSquared(this.pposition, this.position) >= this.opts.trailPitch) {
      this.pposition = this.position.clone()
      if (this.opts.trailLength > 0) {
        this.trail.push(this.pposition)
        if (this.trail.length > this.opts.trailLength) {
          this.trail.splice(0, 1)
        }
      }
    }

    this.velocity._add(this.acceleration)
    if (this.velocity.length() > this.opts.maxSpeed) {
      this.velocity._toLength(this.opts.maxSpeed)
    }

    this.position._add(this.velocity)
  }

  get x () { return this.position.x }
  get y () { return this.position.y }
  get z () { return this.position.z }

  get px () { return this.pposition.x }
  get py () { return this.pposition.y }
  get pz () { return this.pposition.z }

  get lastTrail () { return this.trail[0] || this.position }

  get oob () { return Particle.isOob(this.position) }

  static isOob (position) {
    return (position.x < 0 ||
            position.y < 0 ||
            position.z < 0 ||
            position.x > width ||
            position.y > depth ||
            position.z > height)
  }
}

function distanceSquared (a, b) {
  return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2)
}
