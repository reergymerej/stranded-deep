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
  // If two islands have the same measurements, they are the same.
  // For each measurement, return the similarity.
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

const sum = (numbers: number[]): number => {
  return numbers.reduce((acc, value) => acc + value, 0)
}

const average = (numbers: number[]): number => {
  return sum(numbers) / numbers.length
}

const DEGREE_WEIGHT = 9
const DISTANCE_WEIGHT = 1
const weights = DEGREE_WEIGHT + DISTANCE_WEIGHT
const degreeRatio = DEGREE_WEIGHT / weights
const distanceRatio = DISTANCE_WEIGHT / weights

export const compareMeasurements = (a: Measurement, b: Measurement): number => {
  const degrees = compareDegrees(a.degrees, b.degrees)
  const distanceEstimate = compareDistance(a.distanceEstimate, b.distanceEstimate)
  const weighted = {
    degrees: degreeRatio * degrees,
    distanceEstimate: distanceRatio * distanceEstimate,
  }
  const dimensions = [
    weighted.degrees,
    weighted.distanceEstimate,
  ]
  return sum(dimensions)
}

const sortBy = <T, K extends keyof T>(field: K) => (a: T, b: T): number => {
  const aValue = a[field]
  const bValue = b[field]
  if (aValue < bValue) {
    return -1
  } if (aValue < bValue) {
    return 1
  }
  return 0
}

const byDegrees = sortBy<Measurement, 'degrees'>('degrees')

export const compareIslands = (a: Island, b: Island): number => {
  const aSorted = a.sort(byDegrees)
  const bSorted = b.sort(byDegrees)
  if (aSorted.length === bSorted.length) {
    const result: number[] = aSorted.map((aMeasurement, i) => {
      const bMeasurement = bSorted[i]
      return compareMeasurements(aMeasurement, bMeasurement)
    })
    return average(result)
  } else {
    throw new Error('I do not know how to handle missing measurements.')
  }
}
