import * as mod from './parser'
import fs from 'fs'
import path from 'path'
import {Fingerprint2, NamedIsland} from './types'

const filepath = path.join(
  __dirname,
  '../measurements.md')
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

  describe('naming fingerprints', () => {
    let fingerprints: Fingerprint2[] = []
    beforeEach(() => {
      fingerprints = mod.toFingerPrints(file)
    })

    it('should give names to each', () => {
      const named: NamedIsland[] = mod.nameFingerPrints(fingerprints)
      expect(named.length).toBeGreaterThan(0)
      named.forEach(x => {
        expect(x.name).toEqual(expect.any(String))
      })
    })
  })
})
