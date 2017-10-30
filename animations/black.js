'use strict'

const path = require('path')
const { paths, config } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Black extends Animation {
  constructor (manager, offset) {
    super(manager, offset)
  }

  update (dt) {
    super.update(dt)
    this.clear()
  }
}
