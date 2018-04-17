/**
 * NOTE:
 * the leap Y component is vertical : stratum Y is horizontal
 * the leap Z component is horizontal : stratum Z is vertical
 * SEE: https://developer.leapmotion.com/documentation/csharp/devguide/Leap_Coordinate_Mapping.html
 */

'use strict'

const path = require('path')
const { args, paths, log } = require(path.join(__dirname, '..', 'main.config.js'))
const { normalize, clamp } = require('missing-math')

const MockHand = require(path.join(paths.utils, 'leap-mockhand'))
const leapjs = require('leapjs')
const controller = new leapjs.Controller()

if (args.leap) {
  controller.on('streamingStarted', () => log.info('A Leap device has been connected.'))
  controller.on('streamingStopped', () => log.info('A Leap device has been disconnected.'))
  controller.on('connect', function () {
    log.info('Successfully connected.')
    // NOTE: this block fixes the lame leapmotion's handling of malformed packets
    // https://github.com/leapmotion/leapjs/issues/219
    const originalHandleData = this.connection.handleData
    this.connection.handleData = function (data) {
      try {
        return originalHandleData.call(this, data)
      } catch (e) {
        log.warning(e)
      }
    }
  })
  controller.connect()
}

function getEnsuredHandProperty (key, frame) {
  frame = frame || controller.frame(0)
  if (frame.hands[0]) return typeof frame.hands[0][key] === 'function' ? frame.hands[0][key]() : frame.hands[0][key]
}

const mockHand = new MockHand([0.5, 0.5, 0.5])

module.exports = {
  controller,
  timeVisible: () => getEnsuredHandProperty('timeVisible'),
  hand (box = [1, 1, 1]) {
    const frame = controller.frame(0)
    const interactionBox = frame.interactionBox
    const handPosition = getEnsuredHandProperty('palmPosition', frame)
    const rollRadians = getEnsuredHandProperty('roll', frame)

    if (interactionBox && handPosition && rollRadians) {
      const normalizedPosition = interactionBox.normalizePoint(handPosition, true)
      // override normalizedPosition[0] (X axis) by the normalized roll angle of the hand
      normalizedPosition[0] = clamp(normalize(rollRadians, -Math.PI / 2, Math.PI / 2), 0, 1)
      mockHand.normalizedPosition = normalizedPosition
      return {
        x: normalizedPosition[0] * box[0],
        y: normalizedPosition[2] * box[1],
        z: normalizedPosition[1] * box[2]
      }
    }
    return mockHand.update(box)
  }
}
