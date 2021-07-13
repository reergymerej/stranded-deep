import { Measurement } from '../'
import * as main from '../'
import * as names from './name'

export type Fingerprint = Measurement[]

export type NamedIsland = {
  fingerprint: Fingerprint,
  name: string,
}

export type LogEntry = {
  origin: Fingerprint | null,
  fingerprint: Fingerprint,
  next: Measurement | null,
}
export type Log = LogEntry[]

export type RouteEntry = {
  origin: Fingerprint | null,
  location: Fingerprint,
  locationName?: string,
}

export type Route = RouteEntry[]

export const findIslandInList = (
  namedIslands: NamedIsland[],
  fingerprint: Fingerprint,
  threshold = 0.7,
): NamedIsland | undefined =>
  namedIslands.find(
    namedIsland =>
    main.compareIslands(fingerprint, namedIsland.fingerprint) >= threshold
  )

export const getLocationName = (fingerprint: Fingerprint, namedIslands: NamedIsland[]): string => {
  const found = findIslandInList(namedIslands, fingerprint)
  if (found) {
    return found.name
  }
  // Side effect - add new named location????
  return names.next()
}

const logEntryToRouteEntry = (logEntry: LogEntry): RouteEntry => {
  const routeEntry: RouteEntry = {
    origin: logEntry.origin,
    location: logEntry.fingerprint,
    // locationName: getLocationName(logEntry.fingerprint, namedIslands),
  }
  return routeEntry
}

export const getRoute = (log: Log): Route => {
  const route: Route = log.map(logEntryToRouteEntry)
  return route
}

