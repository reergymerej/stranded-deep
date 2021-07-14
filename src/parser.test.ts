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

const toLog = (namedIsland: NamedIsland): string => {
  const lines = [
    `# Measurements - ${namedIsland.name}`,
    ...namedIsland.fingerprint.map(x => {
      const {
        degrees,
        distanceEstimate,
        distanceMeasurement,
        next,
        origin,
      } = x
      const sections = [
        '*',
        degrees.toString().padStart(3, '0'),
        (DistanceEstimate[distanceEstimate] || '').toLowerCase(),
        (distanceMeasurement && `${distanceMeasurement.hours}:${distanceMeasurement.minutes}`),
        next && 'next',
        origin && 'origin',
      ]
      return sections
        .filter(x => x)
        .join(' ')
    }),
  ]
  return lines.join('\n')
}

describe('naming fingerprints', () => {
  let fingerprints: Fingerprint2[] = []
  beforeEach(() => {
    fingerprints = mod.toFingerPrints(file)
  })

  it('should give names to each', () => {
    const named: NamedIsland[] = mod.nameFingerPrints(fingerprints)
    expect(named.length).toBeGreaterThan(0)
    const logged: string[] = []
    named.forEach(x => {
      expect(x.name).toEqual(expect.any(String))
      logged.push(toLog(x))
    })

    console.log(logged.join('\n\n'))
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
