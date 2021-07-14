import * as main from '../'
import * as names from './name'
import {NamedIsland, Fingerprint, LogEntry, RouteEntry, Log, Route} from '../types'

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

