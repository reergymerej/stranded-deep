import * as mod from './slotting'

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
    const actual = mod.getRight(a, afterA)
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
    const actual = mod.getLeft(a, beforeA)
    expect(actual).toBe(expected)
  })
})

describe('getItemBefore', () => {
  it('should should return the one before', () => {
    const list = [0, 90, 180, 270]
    expect(mod.getItemBefore(list, 1)).toBe(list[0])
  })

  it('should should return the one before, even if it has to loop', () => {
    const list = [0, 90, 180, 270]
    expect(mod.getItemBefore(list, 0)).toBe(list[3])
  })
})

describe('getItemAfter', () => {
  it('should should return the one after', () => {
    const list = [0, 90, 180, 270]
    expect(mod.getItemAfter(list, 1)).toBe(list[2])
  })

  it('should should return the one after, even if it has to loop', () => {
    const list = [0, 90, 180, 270]
    expect(mod.getItemAfter(list, 3)).toBe(list[0])
  })
})

describe('getSlotSection', () => {
  it.each<[
    number[], // list
    number, // index
    mod.SlotSection, // expected
  ]>([
    [
      [0, 90, 180, 270],
      0,
      {
        min: 315,
        center: 0,
        max: 45,
      },
    ],
    [
      [0, 90, 180, 270],
      1,
      {
        min: 45,
        center: 90,
        max: 135,
      },
    ],
    [
      [0, 90, 180, 270],
      2,
      {
        min: 135,
        center: 180,
        max: 225,
      },
    ],
    [
      [0, 90, 180, 270],
      3,
      {
        min: 225,
        center: 270,
        max: 315,
      },
    ],
    [
      [90],
      0,
      {
        min: 270,
        center: 90,
        max: 270,
      },
    ],
  ])('%s, %d = %s', (list, index, expected) => {
    const actual = mod.getSlotSection(list, index)
    expect(actual).toEqual(expected)
  })
})
