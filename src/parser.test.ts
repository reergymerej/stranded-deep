import * as mod from './parser'
import fs from 'fs'
import path from 'path'

const filepath = path.resolve('/Users/jeremygreer/Desktop/strandeddeep/measurements.md')
const file = fs.readFileSync(filepath, 'utf8')

describe('', () => {
  it('should parse a log', () => {
    const fingerprints = mod.toFingerPrints(file)
    fingerprints.forEach(x => {
      x.forEach(y => {
        expect(y).toMatchObject({
          degrees: expect.any(Number),
        })
      })
    })
  })

  fdescribe('naming fingerprints', () => {
    let fingerprints: mod.Fingerprint[] = []
    beforeEach(() => {
      fingerprints = mod.toFingerPrints(file)
    })

    it('should give names to each', () => {
      const named = mod.nameFingerPrints(fingerprints)
      console.log(named)
    })
  })
})
