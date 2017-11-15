/**
 * NOTE:
 * the leap Y component is vertical : stratum Y is horizontal
 * the leap Z component is horizontal : stratum Z is vertical
 * SEE: https://developer.leapmotion.com/documentation/csharp/devguide/Leap_Coordinate_Mapping.html
 */

'use strict'

const path = require('path')
const { args, paths, log } = require(path.join(__dirname, '..', 'main.config.js'))

const MockHand = require(path.join(paths.utils, 'leap-mockhand'))
const leapjs = require('leapjs')
const controller = new leapjs.Controller()

if (args.leap) {
  controller.on('connect', () => log.info('Successfully connected.'))
  controller.on('streamingStarted', () => log.info('A Leap device has been connected.'))
  controller.on('streamingStopped', () => log.info('A Leap device has been disconnected.'))

  controller.connect()
}

function getEnsuredHandProperty (key, frame) {
  frame = frame || controller.frame(0)
  if (frame.hands[0]) return frame.hands[0][key]
}

const mockHand = new MockHand([0.5, 0.5, 0.5])

module.exports = {
  controller,
  timeVisible: () => getEnsuredHandProperty('timeVisible'),
  hand (box = [1, 1, 1]) {
    const frame = controller.frame(0)
    const interactionBox = frame.interactionBox
    const handPosition = getEnsuredHandProperty('palmPosition', frame)
    if (interactionBox && handPosition) {
      const normalizedPosition = interactionBox.normalizePoint(handPosition, true)
      mockHand.normalizedPosition = normalizedPosition
      return {
        x: normalizedPosition[0] * box[0],
        y: normalizedPosition[2] * box[1],
        z: normalizedPosition[1] * box[2]
      }
    }

    return mockHand.update(box)
  },
}
