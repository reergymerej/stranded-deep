export enum Estimate {
  CLOSE,
  MEDIUM,
  FAR,
}

type Time = {
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

export const getValue = (island: Island): number => {
  return island[0].degrees
}

export const compare = (a: Island, b: Island): number => {
  const aValue = getValue(a)
  const bValue = getValue(b)
  const similarity = 1 - (Math.abs(aValue - bValue))
  return similarity
}

const quantifyDistance = (a: Estimate): number => {
  switch (a) {
    case Estimate.CLOSE:
      return 0
    case Estimate.MEDIUM:
      return 1
    case Estimate.FAR:
      return 2
    default:
      throw new Error(`unhandled case "${a}"`)
  }
}

export const compareDistance = (a: Estimate, b: Estimate): number => {
  const aValue = quantifyDistance(a)
  const bValue = quantifyDistance(b)
  const diff = Math.abs(aValue - bValue)
  switch(diff) {
    case 0:
      return 1
    case 1:
      return 0.5
    case 2:
      return 0
    default:
      throw new Error(`unhandled case "${diff}"`)
  }
}

export const getDegreeDiff = (a: number, b: number): number => {
  const diff = Math.abs(a - b)
  if (diff > 180) {
    return 360 - diff
  }
  return diff
}

export const compareDegrees = (a: number, b: number): number => {
  const diff = getDegreeDiff(a, b)
  const similarity = 1 - (diff / 180)
  return similarity
}
