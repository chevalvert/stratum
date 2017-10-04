'use strict'

module.exports = class Point {
  constructor ({x, y, nodeName, index}) {
    this.x = x
    this.y = y
    this.registed = false
    this.nodeName = nodeName
    this.index = index
  }

  register (parentNode) {
    this.registed = true
    this.node = parentNode
  }

  set (z, rgb) {
    if (this.node) this.node.setLed(this.index, z, rgb)
  }
}
