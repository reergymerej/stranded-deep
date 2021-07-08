import * as mod from '.'

const getMeasurement = (data: Partial<mod.Measurement> = {
}): mod.Measurement => ({
  degrees: 0,
  distanceEstimate: 0,
  ...data,
})

xdescribe('islands', () => {
  describe('comparing', () => {
    describe('when they are quite different', () => {
      it('should give a low match likelihood', () => {
        const islandA: mod.Island = [
          getMeasurement({
            degrees: 0,
          }),
        ]
        const islandB: mod.Island = [
          getMeasurement({
            degrees: 1,
          }),
        ]
        expect(mod.compare(islandA, islandB)).toBeLessThan(0.5)
      })
    })

    describe('when they are quite similar', () => {
      it('should give a high match likelihood', () => {
        const islandA: mod.Island = [
          getMeasurement({
            degrees: 1,
          }),
        ]
        const islandB: mod.Island = [
          getMeasurement({
            degrees: 0.8,
          }),
        ]
        expect(mod.compare(islandA, islandB)).toBeGreaterThan(0.5)
      })
    })
  })

  describe('getValue', () => {
    it('should quantify an island', () => {
      const islandA: mod.Island = [
        getMeasurement({
          degrees: 1,
        }),
      ]
      const actual = mod.getValue(islandA)
      const expected = 1
      expect(actual).toBe(expected)
    })
  })
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
  it.each<[number, mod.Measurement, mod.Measurement]>([
    [
      1,
      getMeasurement({ degrees: 0 }),
      getMeasurement({ degrees: 0 }),
    ],
    [
      0.5,
      getMeasurement({ degrees: 0 }),
      getMeasurement({ degrees: 180 }),
    ],
    [
      0.75,
      getMeasurement({
        degrees: 0,
        distanceEstimate: mod.Estimate.CLOSE,
      }),
      getMeasurement({
        degrees: 0,
        distanceEstimate: mod.Estimate.MEDIUM,
      }),
    ],
    [
      0.25,
      getMeasurement({
        degrees: 0,
        distanceEstimate: mod.Estimate.CLOSE,
      }),
      getMeasurement({
        degrees: 180,
        distanceEstimate: mod.Estimate.MEDIUM,
      }),
    ],
    [
      0,
      getMeasurement({
        degrees: 270,
        distanceEstimate: mod.Estimate.CLOSE,
      }),
      getMeasurement({
        degrees: 90,
        distanceEstimate: mod.Estimate.FAR,
      }),
    ],
  ])('should return an average of the different component comparisons', (expected, a, b) => {
    expect(mod.compareMeasurements(a, b)).toBeCloseTo(expected, 1)
  })
})
