import {getLocationName} from './stitcher'
import {
  Degrees,
  DistanceEstimate,
  DistanceTime,
  Fingerprint2,
  Fingerprint as Island,
  Measurement as MeasurementOriginal,
  Measurement2,
  NamedIsland,
  Navigation,
  isDistanceTime,
} from './types'

const getDegrees = (raw: string): Degrees => {
  return parseInt(raw, 10)
}

const getNavigation = (raw = ''): Navigation => {
  const trimmed = raw.trim()
  return {
    next: trimmed === 'next',
    origin: raw === 'origin',
  }
}

const getEstimateFromString = (value: string): DistanceEstimate => {
  switch (value) {
    case 'close':
      return DistanceEstimate.CLOSE
    case 'medium':
      return DistanceEstimate.MEDIUM
    case 'far':
      return DistanceEstimate.FAR
    default:
      throw new Error(`unhandled case "${value}"`)
  }
}

export const getDistance = (raw: string): DistanceEstimate | DistanceTime => {
  const estimate = (/close|medium|far/).exec(raw)
  if (estimate) {
    return getEstimateFromString(estimate[0])
  }
  const regex = /(\d):(\d\d)/
  const matches = regex.exec(raw)
  const [,
    hoursRaw,
    minutesRaw,
  ] = matches
  return {
    hours: parseInt(hoursRaw, 10),
    minutes: parseInt(minutesRaw, 10),
  }
}

const toMeasurement = (raw: string): Measurement2 => {
  const regex = /^(\d{3,}) ([^ ]+)( origin| next)?\n/g
  const matches = regex.exec(raw)
  const [,
    degreesRaw,
    distanceRaw,
    navigationRaw
  ] = matches
  const degrees = getDegrees(degreesRaw)
  const navigation = getNavigation(navigationRaw)
  const distance = getDistance(distanceRaw)
  return {
    ...navigation,
    degrees,
    distance,
    distanceEstimate: isDistanceTime(distance)
      ? undefined
      : distance,
    distanceMeasurement: isDistanceTime(distance)
      ? distance
      : undefined
  }
}

const toFingerprint = (raw: string): Fingerprint2 => {
  return raw.split(/\* /g)
    .filter(x => x)
    .map(toMeasurement)
}

export const toFingerPrints = (raw: string): Fingerprint2[] => {
  return raw.split(/# Measurement.*\n/g)
    .filter(x => x)
    .map(toFingerprint)
}

const fingerPrintLineToIslandLine = (fpl: Measurement2): MeasurementOriginal => {
  return {
    degrees: fpl.degrees,
    distanceEstimate: fpl.distanceEstimate,
    distanceMeasurement: fpl.distanceMeasurement,
    next: fpl.next,
    origin: fpl.origin,
  }
}

const toIsland = (fingerprint: Fingerprint2): Island => {
  return fingerprint.map(fingerPrintLineToIslandLine)
}

export const nameFingerPrints = (fingerprints: Fingerprint2[]): NamedIsland[] => {
  const namedIslands: NamedIsland[] = []
  const islands: Island[] = fingerprints.map(toIsland)
  islands.forEach(island => {
    const name = getLocationName(island, namedIslands)
    namedIslands.push({
      name,
      fingerprint: island,
    })
  })
  return namedIslands
}
