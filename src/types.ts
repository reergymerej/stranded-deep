export type SlotSection = {
  min: number,
  center: number,
  max: number,
}
export type Slots = SlotSection[]
export type PairedWithSlots = [number, number | null][]


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

export enum DistanceEstimate {
  CLOSE,
  MEDIUM,
  FAR,
}

export type DistanceTime = {
  hours: number,
  minutes: number,
}

export type Navigation = {
  next?: boolean,
  origin?: boolean,
}

export type Degrees = number



export type Time = {
  hours: number,
  minutes: number,
}

export type Measurement = {
  degrees: Degrees,
  distanceEstimate?: DistanceEstimate,
  distanceMeasurement?: Time,
} & Navigation

export type Measurement2 = {
  degrees: Degrees,
  // TODO: split and deprecate
  distance: DistanceEstimate | DistanceTime,

  distanceEstimate?: DistanceEstimate,
  distanceMeasurement?: Time,
} & Navigation

export type Fingerprint2 = Measurement2[]
export type Fingerprint = Measurement[]

export type NamedIsland = {
  fingerprint: Fingerprint,
  name: string,
}

export const isDistanceTime = (distance: DistanceEstimate | DistanceTime): distance is DistanceTime => {
  return (distance as DistanceTime).minutes !== undefined
}
