import * as mod from './name'

test('it should return names as expected', () => {
  const actual = mod.next()
  expect(actual).toEqual('Apricot')
})
