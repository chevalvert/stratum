'use strict'

module.exports = class Animation {
  constructor (manager) {
    this.manager = manager
    this.count = 0
  }

  update (dt) {
    this.count += dt / 1000
  }

  get name () {
    return this.constructor.name
  }
}
