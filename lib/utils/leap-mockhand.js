'use strict'

const path = require('path')
const { config } = require(path.join(__dirname, '..', '..', 'main.config.js'))

module.exports = class MockHand {
  constructor (normalizedPosition) {
    this.normalizedPosition = [...normalizedPosition]
    this.target = [...normalizedPosition]
  }

  update (box) {
    this.normalizedPosition.forEach((_, index) => {
      const d = this.target[index] - this.normalizedPosition[index]
      this.normalizedPosition[index] += d * config.mockHandEasing
    })

    return {
      x: this.normalizedPosition[0] * box[0],
      y: this.normalizedPosition[2] * box[1],
      z: this.normalizedPosition[1] * box[2]
    }
  }
}
