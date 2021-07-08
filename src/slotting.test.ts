import { getDegreeDiff } from '.'

const getRight = (a: number, b: number): number => {
  const diff = getDegreeDiff(a, b)
  return (a + diff/2) % 360
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
  ])('%s = %s, %s', (expected, a, b) => {
    const actual = getRight(a, b)
    expect(actual).toBe(expected)
  })
})
