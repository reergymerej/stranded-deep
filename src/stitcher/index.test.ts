import * as mod from './'
import * as names from './name'
import { Estimate } from '../'
import {Fingerprint, NamedIsland, getLocationName} from './'

const fingerprints: {[key: string]: mod.Fingerprint} = {
  A: [
    {
      degrees: 90,
      distanceEstimate: Estimate.MEDIUM,
    },
    {
      degrees: 180,
      distanceEstimate: Estimate.MEDIUM,
    },
  ],
  B: [
    {
      degrees: 225,
      distanceEstimate: Estimate.MEDIUM,
    },
    {
      degrees: 270,
      distanceEstimate: Estimate.MEDIUM,
    },
  ],
  C: [
    {
      degrees: 45,
      distanceEstimate: Estimate.MEDIUM,
    },
    {
      degrees: 0,
      distanceEstimate: Estimate.MEDIUM,
    },
  ],
  Boop: [
    {
      distanceEstimate: Estimate.FAR,
      degrees: 99,
    },
  ],
  BoopOpposite: [
    {
      distanceEstimate: Estimate.CLOSE,
      degrees: 279,
    },
  ],
  Beep: [
    {
      distanceEstimate: Estimate.FAR,
      degrees: 95,
    },
  ],
  NotInList: [
    {
      distanceEstimate: Estimate.FAR,
      degrees: 11,
    },
  ],
}

const namedIslands: mod.NamedIsland[] = [
  {
    fingerprint: fingerprints.A,
    name: names.next(),
  },
  {
    fingerprint: fingerprints.B,
    name: names.next(),
  },
  {
    fingerprint: fingerprints.C,
    name: names.next(),
  },
  {
    fingerprint: fingerprints.Boop,
    name: names.next(),
  },
]

it('should return the route based on the log', () => {
  const log: mod.Log = [
    {
      origin: null,
      fingerprint: fingerprints.A,
      next: fingerprints.A[0],
    },
  ]
  const actual = mod.getRoute(log)
  const expected: mod.Route = [
    {
      location: fingerprints.A,
      origin: null,
    },
  ]
  expect<mod.Route>(actual).toEqual<mod.Route>(expected)
})

test('2 step log', () => {
  const log: mod.Log = [
    {
      origin: null,
      fingerprint: fingerprints.A,
      next: fingerprints.A[0],
    },
    {
      origin: fingerprints.A,
      fingerprint: fingerprints.B,
      next: null,
    },
  ]
  const actual = mod.getRoute(log)
  const expected: mod.Route = [
    {
      origin: null,
      location: fingerprints.A,
    },
    {
      origin: fingerprints.A,
      location: fingerprints.B,
    },
  ]
  expect<mod.Route>(actual).toEqual<mod.Route>(expected)
})

it('should figure out when it has returned to fingerprint A', () => {
  // The log doesn't know these fingerprints by name.  We're just adding that for
  // test convenience.
  const log: mod.Log = [
    {
      origin: null,
      fingerprint: fingerprints.A,
      next: fingerprints.A[0],
    },
    {
      origin: fingerprints.A,
      fingerprint: fingerprints.B,
      next: fingerprints.B[0],
    },
    {
      origin: fingerprints.B,
      fingerprint: fingerprints.C,
      next: fingerprints.C[0],
    },
    {
      origin: fingerprints.C,
      fingerprint: fingerprints.A,
      next: null,
    },
  ]
  const actual = mod.getRoute(log)
  const expected: mod.Route = [
    {
      origin: null,
      location: fingerprints.A,
    },
    {
      origin: fingerprints.A,
      location: fingerprints.B,
    },
    {
      origin: fingerprints.B,
      location: fingerprints.C,
    },
    {
      origin: fingerprints.C,
      location: fingerprints.A,
    },
  ]
  expect<mod.Route>(actual).toEqual<mod.Route>(expected)
})

describe('identifying a NamedIsland by fingerprint', () => {
  describe('when there is no match', () => {
    it('should return undefined', () => {
      const fingerprint: mod.Fingerprint = fingerprints.NotInList
      const actual = mod.findIslandInList(namedIslands, fingerprint)
      const expected = undefined
      expect(actual).toEqual(expected)
    })
  })

  describe('when there is no close match', () => {
    it('should return undefined', () => {
      const fingerprint: Fingerprint = fingerprints.BoopOpposite
      const actual = mod.findIslandInList(namedIslands, fingerprint)
      const expected = undefined
      expect(actual).toEqual(expected)
    })
  })

  describe('when there is a close match', () => {
    it('should return the matched NamedIsland', () => {
      const fingerprint: Fingerprint = fingerprints.Beep
      const actual = mod.findIslandInList(namedIslands, fingerprint)
      const expected: NamedIsland = namedIslands.find(x => x.fingerprint === fingerprints.Boop)
      expect(actual).toEqual(expected)
    })
  })
})

describe('getLocationName', () => {
  xdescribe('when we have not named any yet', () => {
    it('should return the next name', () => {
      const fingerprint: mod.Fingerprint = fingerprints.A
      const actual = mod.getLocationName(fingerprint, namedIslands)
      const expected = 'Apricot'
      expect(actual).toBe(expected)
    })
  })

  describe('when we named some and recognize this', () => {
    it('should return the same name', () => {
      const fingerprint: Fingerprint = fingerprints.B
      const actual = getLocationName(fingerprint, namedIslands)
      const expected = 'Blackberry'
      expect(actual).toBe(expected)
    })
  })
})
