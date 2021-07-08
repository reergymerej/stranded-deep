import { getDegreeDiff } from '.'

export const getRight = (a: number, afterA: number): number => {
  const diff = getDegreeDiff(a, afterA)
  return (a + diff/2) % 360
}

export const getLeft = (a: number, beforeA: number): number => {
  const diff = getDegreeDiff(a, beforeA)
  const r = (a - diff/2)
  return r < 0
    ? 360 + r
    : r
}

export const getItemBefore = <T>(list: T[], index: number): T => {
  const beforeIndex = index === 0
    ? list.length - 1
    : index - 1
  return list[beforeIndex]
}

export const getItemAfter = <T>(list: T[], index: number): T => {
  const afterIndex = index === list.length - 1
    ? 0
    : index + 1
  return list[afterIndex]
}

export type SlotSection = {
  min: number,
  center: number,
  max: number,
}
const opposite = (degrees: number): number => {
  return (degrees + 180) % 360
}

export const getSlotSection = (list: number[], index: number): SlotSection => {
  if (list.length === 1) {
    return {
      min: opposite(list[0]),
      center: list[0],
      max: opposite(list[0]),
    }
  }
  const center = list[index]
  const beforeCenter = getItemBefore<number>(list, index)
  const afterCenter = getItemAfter<number>(list, index)
  const min = getLeft(center, beforeCenter)
  const max = getRight(center, afterCenter)
  return {
    min,
    center,
    max,
  }
}
