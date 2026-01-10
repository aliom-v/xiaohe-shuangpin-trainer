import { getDailyRecords, getErrorRecords, getPracticeStats } from './learning'

describe('learning storage validation', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns defaults for invalid error records', () => {
    localStorage.setItem('shuangpin_errors', 'not-json')
    expect(getErrorRecords()).toEqual({})
  })

  it('returns defaults for invalid practice stats', () => {
    localStorage.setItem('shuangpin_stats', JSON.stringify({ totalChars: 'x' }))
    expect(getPracticeStats()).toEqual({
      totalChars: 0,
      totalErrors: 0,
      totalTime: 0,
      sessions: 0,
      lastPractice: 0,
    })
  })

  it('returns defaults for invalid daily records', () => {
    localStorage.setItem('shuangpin_daily', JSON.stringify([{ date: '2024-01-01' }]))
    expect(getDailyRecords()).toEqual([])
  })

  it('loads valid error records', () => {
    const payload = {
      '你': { char: '你', pinyin: 'ni', shuangpin: 'ni', errorCount: 1, totalCount: 2, lastError: 123 },
    }
    localStorage.setItem('shuangpin_errors', JSON.stringify(payload))
    expect(getErrorRecords()).toEqual(payload)
  })
})
