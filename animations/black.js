'use strict'

const path = require('path')
const { paths } = require(path.join(__dirname, '..', 'main.config.js'))
const Animation = require(path.join(paths.utils, 'animation'))

module.exports = class Black extends Animation {
  update (dt) {
    super.update(dt)
    this.clear()
  }
}
