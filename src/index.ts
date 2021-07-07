enum Estimate {
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
