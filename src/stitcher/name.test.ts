import * as mod from './name'

test('it should return names as expected', () => {
  const actual = [
    mod.next(),
    mod.next(),
  ]
  expect(actual).toEqual( [
    'Apricot',
    'Blackberry',
  ])
})

test('it should reset', () => {
  mod.reset()
  const actual = mod.next()
  expect(actual).toEqual('Apricot')
})
