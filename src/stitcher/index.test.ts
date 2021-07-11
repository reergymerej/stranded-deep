import { Measurement, Estimate } from '../'
import * as main from '../'
import * as names from './name'

const ftest = fit

type Fingerprint = Measurement[]

type NamedIsland = {
  fingerprint: Fingerprint,
  name: string,
}

type LogEntry = {
  origin: Fingerprint | null,
  fingerprint: Fingerprint,
  next: Measurement | null,
}
type Log = LogEntry[]

type RouteEntry = {
  origin: Fingerprint | null,
  location: Fingerprint,
  locationName?: string,
}

type Route = RouteEntry[]

const fingerprints: {[key: string]: Fingerprint} = {
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

const namedIslands: NamedIsland[] = [
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

const findIslandInList = (
  namedIslands: NamedIsland[],
  fingerprint: Fingerprint,
  threshold = 0.7,
): NamedIsland | undefined =>
  namedIslands.find(
    namedIsland =>
    main.compareIslands(fingerprint, namedIsland.fingerprint) >= threshold
  )

describe('identifying a NamedIsland by fingerprint', () => {
  describe('when there is no match', () => {
    it('should return undefined', () => {
      const fingerprint: Fingerprint = fingerprints.NotInList
      const actual = findIslandInList(namedIslands, fingerprint)
      const expected = undefined
      expect(actual).toEqual(expected)
    })
  })

  describe('when there is no close match', () => {
    it('should return undefined', () => {
      const fingerprint: Fingerprint = fingerprints.BoopOpposite
      const actual = findIslandInList(namedIslands, fingerprint)
      const expected = undefined
      expect(actual).toEqual(expected)
    })
  })

  describe('when there is a close match', () => {
    it('should return the matched NamedIsland', () => {
      const fingerprint: Fingerprint = fingerprints.Beep
      const actual = findIslandInList(namedIslands, fingerprint)
      const expected: NamedIsland = namedIslands.find(x => x.fingerprint === fingerprints.Boop)
      expect(actual).toEqual(expected)
    })
  })
})

const getLocationName = (fingerprint: Fingerprint, namedIslands: NamedIsland[]): string => {
  const found = findIslandInList(namedIslands, fingerprint)
  if (found) {
    return found.name
  }
  // Side effect - add new named location????
  return names.next()
}

describe('getLocationName', () => {
  xdescribe('when we have not named any yet', () => {
    it('should return the next name', () => {
      const fingerprint: Fingerprint = fingerprints.A
      const actual = getLocationName(fingerprint, namedIslands)
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

const logEntryToRouteEntry = (logEntry: LogEntry): RouteEntry => {
  const routeEntry: RouteEntry = {
    origin: logEntry.origin,
    location: logEntry.fingerprint,
    // locationName: getLocationName(logEntry.fingerprint, namedIslands),
  }
  return routeEntry
}

const getRoute = (log: Log): Route => {
  const route: Route = log.map(logEntryToRouteEntry)
  return route
}

it('should return the route based on the log', () => {
  const log: Log = [
    {
      origin: null,
      fingerprint: fingerprints.A,
      next: fingerprints.A[0],
    },
  ]
  const actual = getRoute(log)
  const expected: Route = [
    {
      location: fingerprints.A,
      origin: null,
    },
  ]
  expect<Route>(actual).toEqual<Route>(expected)
})

test('2 step log', () => {
  const log: Log = [
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
  const actual = getRoute(log)
  const expected: Route = [
    {
      origin: null,
      location: fingerprints.A,
    },
    {
      origin: fingerprints.A,
      location: fingerprints.B,
    },
  ]
  expect<Route>(actual).toEqual<Route>(expected)
})

it('should figure out when it has returned to fingerprint A', () => {
  // The log doesn't know these fingerprints by name.  We're just adding that for
  // test convenience.
  const log: Log = [
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
  const actual = getRoute(log)
  const expected: Route = [
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
  expect<Route>(actual).toEqual<Route>(expected)
})
