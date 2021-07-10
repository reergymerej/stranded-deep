const names = [
  'Apricot',
  'Blackberry',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grapefruit',
  'Honeydew',
  'Jackfruit',
  'Kiwano ',
  'Lemon',
  'Mango',
  'Nectarine',
  'Orange',
  'Pomelo',
  'Quince',
  'Raspberry',
  'Soursop',
  'Tamarind',
  'Ugli fruit',
  'Watermelon',
  'Yuzu',
]

export const next = (): string => {
  return names.shift()
}
