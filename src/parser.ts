type DistanceEstimate = 'close' | 'medium' | 'far'
type DistanceTime = {
  hours: number,
  minutes: number,
}

type Navigation = {
  next?: boolean,
  origin?: boolean,
}

type Degrees = number
type Measurement = {
  degrees: Degrees,
  distance: DistanceEstimate | DistanceTime,
} & Navigation


export type Fingerprint = Measurement[]

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

const getDistance = (raw: string): DistanceEstimate | DistanceTime => {
  const estimate = (/close|medium|far/).exec(raw)
  if (estimate) {
    return estimate[0] as DistanceEstimate
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

const toMeasurement = (raw: string): Measurement => {
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
  }
}

const toFingerprint = (raw: string): Fingerprint => {
  return raw.split(/\* /g)
    .filter(x => x)
    .map(toMeasurement)
}

export const toFingerPrints = (raw: string): Fingerprint[] => {
  return raw.split(/# Measurement.*\n/g)
    .filter(x => x)
    .map(toFingerprint)
}

export const nameFingerPrints = (fingerprints: Fingerprint[]) => {
}
