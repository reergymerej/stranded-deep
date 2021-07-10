import { Measurement, Estimate } from '../'
const ftest = fit

type Island = Measurement[]

type LogEntry = {
  origin: Island | null,
  measurements: Measurement[],
  next: Measurement | null,
}
type Log = LogEntry[]

type RouteEntry = {
  location: Island | null,
  origin: Island | null,
}

type Route = RouteEntry[]

const logEntryToRouteEntry = (logEntry: LogEntry): RouteEntry => {
  const routeEntry: RouteEntry = {
    origin: logEntry.origin,
    location: logEntry.measurements,
  }
  return routeEntry
}

const getRoute = (log: Log): Route => {
  const route: Route = log.map(logEntryToRouteEntry)
  return route
}

const islands: {[key: string]: Island} = {
  A: [
    {
      degrees: 90,
      distanceEstimate: Estimate.MEDIUM,
    },
  ],
  B: [
    {
      degrees: 270,
      distanceEstimate: Estimate.MEDIUM,
    },
  ],
}

it('should return the route based on the log', () => {
  const log: Log = [
    {
      origin: null,
      measurements: islands.A,
      next: islands.A[0],
    },
  ]
  const actual = getRoute(log)
  const expected: Route = [
    {
      location: islands.A,
      origin: null,
    },
  ]
  expect<Route>(actual).toEqual<Route>(expected)
})

test('2 step log', () => {
  const log: Log = [
    {
      origin: null,
      measurements: islands.A,
      next: islands.A[0],
    },
    {
      origin: islands.A,
      measurements: islands.B,
      next: null,
    },
  ]
  const actual = getRoute(log)
  const expected: Route = [
    {
      origin: null,
      location: islands.A,
    },
    {
      origin: islands.A,
      location: islands.B,
    },
  ]
  expect<Route>(actual).toEqual<Route>(expected)
})
