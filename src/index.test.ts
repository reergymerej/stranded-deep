import * as mod from '.'

const getMeasurement = (data: Partial<mod.Measurement> = {
}): mod.Measurement => ({
  degrees: 0,
  distanceEstimate: mod.Estimate.MEDIUM,
  ...data,
})

describe('distanceEstimate comparing', () => {
  it.each([
    [
      1,
      mod.Estimate.CLOSE,
      mod.Estimate.CLOSE,
    ],
    [
      0.5,
      mod.Estimate.CLOSE,
      mod.Estimate.MEDIUM,
    ],
    [
      0.5,
      mod.Estimate.FAR,
      mod.Estimate.MEDIUM,
    ],
    [
      0,
      mod.Estimate.FAR,
      mod.Estimate.CLOSE,
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

describe('degrees comparing', () => {
  it.each([
    [
      1,
      90,
      90,
    ],
    [
      0,
      90,
      270,
    ],
    [
      0.98,
      90,
      95,
    ],
    [
      0.98,
      0,
      355,
    ],
    [
      0.5,
      90,
      180,
    ],
    [
      0.5,
      90,
      0,
    ],
  ])('should return %d for %d, %d', (expected, a, b) => {
    expect(mod.compareDegrees(a, b)).toBeCloseTo(expected, 1)
  })
})

describe('comparing measurements', () => {
  describe('degrees should carry more weight than distance', () => {
    it('should not match when degrees are so far away', () => {
      const a = getMeasurement({
        degrees: 0,
        distanceEstimate: mod.Estimate.CLOSE,
      })
      const b = getMeasurement({
        degrees: 180,
        distanceEstimate: mod.Estimate.CLOSE,
      })
      const actual = mod.compareMeasurements(a, b)
      expect(actual).toBeLessThanOrEqual(0.1)
    })
  })
})

describe('comparing islands', () => {
  it.each<[number, mod.Island, mod.Island]>([
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
          distanceEstimate: mod.Estimate.CLOSE,
        }),
      ],
      [
        getMeasurement({
          degrees: 180,
          distanceEstimate: mod.Estimate.FAR,
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
      0.95,
      [
        getMeasurement({ degrees: 0 }),
        getMeasurement({
          degrees: 90,
          distanceEstimate: mod.Estimate.MEDIUM,
        }),
      ],
      [
        getMeasurement({ degrees: 0 }),
        getMeasurement({
          degrees: 80,
          distanceEstimate: mod.Estimate.FAR,
        }),
      ],
    ],
  ])('should return a composite number of the relationship', (expected, a, b) => {
    const actual = mod.compareIslands(a, b)
    expect(actual).toBeCloseTo(expected, 2)
  })
})
