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

export type Slots = SlotSection[]

const opposite = (degrees: number): number => {
  return (degrees + 180) % 360
}

export const getSlotSection = (center: number, index: number, list: number[]): SlotSection => {
  if (list.length === 1) {
    return {
      min: opposite(center),
      center,
      max: opposite(center),
    }
  }
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

export const getSlots = (list: number[]): Slots => {
  return list.map(getSlotSection)
}

const byNumberAsc = (a: number, b: number): number => a - b

const getLeftAndRightForSlots = (a: number[], b: number[]): { left: number[], right: number[]} => {
  const aSorted = a.sort(byNumberAsc)
  const bSorted = b.sort(byNumberAsc)
  const left = a.length >= b.length
    ? aSorted
    : bSorted
  const right = left === aSorted
    ? bSorted
    : aSorted
    return { left, right }
}

type PairedWithSlots = [number, number | null][]

export const isBetweenDegrees = (left: number, right: number, value: number): boolean => {
  // To make things easier, adjust left so it is 0.  It's confusing if we have
  // to keep moving across 359/0.
  const diff = 360 - left
  const min = (left + diff) % 360
  const max = (right + diff) % 360
  const target = (value + diff) % 360
  return min <= target
    && target <= max
}

export const getSlotMatchIndex = (slots: Slots, value: number): number => {
  const index = slots.findIndex(({ min, max }) => {
    return isBetweenDegrees(min, max, value)
  })
  return index
}

const _pairWithSlots = (slots: Slots, list: number[]): PairedWithSlots => {
  // This assumes slots and list are sorted.
  // This gives a list of each "slots" index where the matching list item
  // belongs.
  const slotIndices = list.map(value => getSlotMatchIndex(slots, value))
  return slots.map(({ center }, i) => {
    const slotIndicesIndex = slotIndices.indexOf(i)
    const pair = slotIndicesIndex > -1
      ? list[slotIndicesIndex]
      : null
    return [
      center,
      pair,
    ]
  })
}

export const pairWithSlots = (a: number[], b: number[]): PairedWithSlots => {
  const { left, right } = getLeftAndRightForSlots(a, b)
  const slots = getSlots(left)
  return _pairWithSlots(slots, right)
}
