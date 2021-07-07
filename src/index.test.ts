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
