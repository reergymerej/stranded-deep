export type SlotSection = {
  min: number,
  center: number,
  max: number,
}
export type Slots = SlotSection[]
export type PairedWithSlots = [number, number | null][]

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


export type DistanceEstimate = 'close' | 'medium' | 'far'
export type DistanceTime = {
  hours: number,
  minutes: number,
}

export type Navigation = {
  next?: boolean,
  origin?: boolean,
}

export type Degrees = number
export type Measurement2 = {
  degrees: Degrees,
  distance: DistanceEstimate | DistanceTime,
} & Navigation

export type Fingerprint2 = Measurement2[]

export enum Estimate {
  CLOSE,
  MEDIUM,
  FAR,
}

export type Time = {
  hours: number,
  minutes: number,
}

export type Measurement = {
  degrees: number,
  distanceEstimate: Estimate,
  distanceMeasurement?: Time,
  origin?: boolean,
  next?: boolean,
}

export type Island = Measurement[]
