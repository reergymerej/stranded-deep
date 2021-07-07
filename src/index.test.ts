import * as mod from '.'

fdescribe('islands', () => {
  describe('comparing', () => {
    describe('when they are quite different', () => {
      it('should give a low match likelihood', () => {
        const islandA = 1
        const islandB = 1
        const compare = () => 0.1
        expect(mod.compare(islandA, islandB)).toBeLessThan(0.5)
      })
    })
  })
})
