import { getDegreeDiff } from '.'

const getRight = (a: number, afterA: number): number => {
  const diff = getDegreeDiff(a, afterA)
  return (a + diff/2) % 360
}

const getLeft = (a: number, afterA: number): number => {
  const diff = getDegreeDiff(a, afterA)
  const r = (a - diff/2)
  return r < 0
    ? 360 + r
    : r
}

describe('getting right', () => {
  it.each([
    [
      45,
      0,
      90,
    ],
    [
      135,
      90,
      180,
    ],
    [
      0,
      270,
      90,
    ],
    [
      76,
      60,
      92,
    ],
  ])('%s = %s, %s', (expected, a, afterA) => {
    const actual = getRight(a, afterA)
    expect(actual).toBe(expected)
  })
})

describe('getting left', () => {
  it.each([
    [
      45,
      90,
      0,
    ],
    [
      135,
      180,
      90,
    ],
    [
      225,
      270,
      180,
    ],
    [
      315,
      0,
      270,
    ],
  ])('%s = %s, %s', (expected, a, beforeA) => {
    const actual = getLeft(a, beforeA)
    expect(actual).toBe(expected)
  })
})
