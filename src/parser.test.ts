import * as mod from './parser'
import fs from 'fs'
import path from 'path'
import {Fingerprint2, NamedIsland, DistanceTime, DistanceEstimate} from './types'

const filepath = path.join(
  __dirname,
  '../measurements.md')
const file = fs.readFileSync(filepath, 'utf8')

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
      console.log(x)
    })
  })
})

describe('getDistance', () => {
  describe('estimates', () => {
    it.each<[DistanceEstimate, string]>([
      [
        DistanceEstimate.FAR,
        '100 far origin',
      ],
      [
        DistanceEstimate.MEDIUM,
        '100 medium origin',
      ],
      [
        DistanceEstimate.CLOSE,
        '100 close origin',
      ],
    ])('should return %s for %s', (expected, input) => {
      const actual = mod.getDistance(input)
      expect(actual).toEqual(expected)
    })
  })

  describe('measurements', () => {
    it('should the hours and minutes', () => {
      const input = '320 1:35 next'
      const actual = mod.getDistance(input)
      const expected: DistanceTime = {
        hours: 1,
        minutes: 35,
      }
      expect(actual).toEqual(expected)
    })
  })
})
