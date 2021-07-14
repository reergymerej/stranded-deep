import * as mod from '.'
import {Measurement, DistanceEstimate, Fingerprint} from './types'

const getMeasurement = (data: Partial<Measurement> = {
}): Measurement => ({
  degrees: 0,
  distanceEstimate: DistanceEstimate.MEDIUM,
  ...data,
})

describe('distanceEstimate comparing', () => {
  it.each([
    [
      1,
      DistanceEstimate.CLOSE,
      DistanceEstimate.CLOSE,
    ],
    [
      0.5,
      DistanceEstimate.CLOSE,
      DistanceEstimate.MEDIUM,
    ],
    [
      0.5,
      DistanceEstimate.FAR,
      DistanceEstimate.MEDIUM,
    ],
    [
      0,
      DistanceEstimate.FAR,
      DistanceEstimate.CLOSE,
    ],
    [
      0,
      undefined,
      DistanceEstimate.FAR,
    ],
  ])('should return %d for %d, %d', (expected, a, b) => {
    expect(mod.compareDistance(a, b)).toBe(expected)
  })
})

describe('getDegreeDiff', () => {
  it.each([
    [
      0,
      90,
      90,
    ],
    [
      180,
      90,
      270,
    ],
    [
      5,
      90,
      95,
    ],
    [
      175,
      275,
      90,
    ],
    [
      5,
      0,
      355,
    ],
  ])('should return %d for %d, %d', (expected, a, b) => {
    expect(mod.getDegreeDiff(a, b)).toBe(expected)
  })
})

describe('degrees sensitivity', () => {
  it.each([
    [0, 1.00],
    [1, 0.99],
    [11, 0.54],
    [23, 0.39],
    [45, 0.25],
    [90, 0.133],
    [180, 0.00],
  ])('when difference is %s, it should return %s', (diff, expected) => {
    // Degrees need to be pretty close to be considered the same.
    jest.spyOn(mod, 'getDegreeDiff').mockReturnValue(diff)
    const actual = mod.compareDegrees(1, 1)
    expect(actual).toBeCloseTo(expected, 1)
  })
})

describe('comparing islands', () => {
  it.each<[number, Fingerprint, Fingerprint]>([
    [
      // total match
      1,
      [
        getMeasurement({ degrees: 0 }),
      ],
      [
        getMeasurement({ degrees: 0 }),
      ],
    ],
    [
      // total opposite
      0,
      [
        getMeasurement({
          degrees: 0,
          distanceEstimate: DistanceEstimate.CLOSE,
        }),
      ],
      [
        getMeasurement({
          degrees: 180,
          distanceEstimate: DistanceEstimate.FAR,
        }),
      ],
    ],
    [
      // total match, unordered
      1,
      [
        getMeasurement({ degrees: 0 }),
        getMeasurement({ degrees: 90 }),
      ],
      [
        getMeasurement({ degrees: 90 }),
        getMeasurement({ degrees: 0 }),
      ],
    ],
    [
      // pretty close
      0.777,
      [
        getMeasurement({ degrees: 0 }),
        getMeasurement({
          degrees: 90,
          distanceEstimate: DistanceEstimate.MEDIUM,
        }),
      ],
      [
        getMeasurement({ degrees: 0 }),
        getMeasurement({
          degrees: 80,
          distanceEstimate: DistanceEstimate.FAR,
        }),
      ],
    ],
    [
      // These are not very similar.
      0.637,
      [
        getMeasurement({ degrees: 0 }),
        getMeasurement({
          degrees: 90,
          distanceEstimate: DistanceEstimate.MEDIUM,
        }),
        getMeasurement({ degrees: 23 }),
      ],
      [
        getMeasurement({ degrees: 0 }),
        getMeasurement({ degrees: 12 }),
        getMeasurement({
          degrees: 60,
          distanceEstimate: DistanceEstimate.FAR,
        }),
      ],
    ],
    [
      // close match, but missing a measurement
      0.621,
      [
        getMeasurement({ degrees: 0 }),
        getMeasurement({ degrees: 90 }),
        getMeasurement({ degrees: 180 }),
        getMeasurement({ degrees: 270 }),
      ],
      [
        getMeasurement({ degrees: 10 }),
        getMeasurement({ degrees: 85 }),
        getMeasurement({ degrees: 275 }),
      ],
    ],
    [
      // That's got to be a match!
      // missing one, a minor diff in deg, and one diff in estimate
      0.909,
      [
        getMeasurement({ degrees: 90 }),
        getMeasurement({ degrees: 180 }),
        getMeasurement({ degrees: 135 }),
        getMeasurement({ degrees: 0 }),
        getMeasurement({ degrees: 45, distanceEstimate: DistanceEstimate.MEDIUM }),
        getMeasurement({ degrees: 225 }),
        getMeasurement({ degrees: 270 }),
        getMeasurement({ degrees: 315 }),
      ],
      [
        getMeasurement({ degrees: 0 }),
        getMeasurement({ degrees: 42, distanceEstimate: DistanceEstimate.FAR }),
        getMeasurement({ degrees: 135 }),
        getMeasurement({ degrees: 270 }),
        getMeasurement({ degrees: 315 }),
        getMeasurement({ degrees: 180 }),
        getMeasurement({ degrees: 90 }),
      ],
    ],
  ])('should return %s', (expected, a, b) => {
    const actual = mod.compareIslands(a, b)
    expect(actual).toBeCloseTo(expected, 2)
  })
})

describe('comparing measurements', () => {
  describe('degrees should carry more weight than distance', () => {
    it('should not match when degrees are so far away', () => {
      const a = getMeasurement({
        degrees: 0,
        distanceEstimate: DistanceEstimate.CLOSE,
      })
      const b = getMeasurement({
        degrees: 180,
        distanceEstimate: DistanceEstimate.CLOSE,
      })
      const actual = mod.compareMeasurements(a, b)
      expect(actual).toBeLessThanOrEqual(0.1)
    })
  })
})
