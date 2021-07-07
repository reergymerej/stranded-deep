import * as mod from '.'

const getMeasurement = (data: Partial<mod.Measurement> = {
}): mod.Measurement => ({
  degrees: 0,
  distanceEstimate: 0,
  ...data,
})

describe('islands', () => {
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

describe('measurements', () => {
  describe('quantify', () => {
    xit('should return sum of degrees and estimate', () => {
      const m: mod.Measurement = {
        degrees: 0,
        distanceEstimate: mod.Estimate.CLOSE,
      }
      expect(mod.quantifyMeasurement(m)).toBe(0)
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
