import { getAllTexts, getRandomText } from './texts'

describe('texts helpers', () => {
  it('returns a random text from the list', () => {
    const all = getAllTexts()
    const value = getRandomText()
    expect(all.includes(value)).toBe(true)
  })
})
