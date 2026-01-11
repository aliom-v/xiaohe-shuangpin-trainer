import assert from 'node:assert/strict'
import { parsePinyinParts, pinyinToShuangpin } from '../src/lib/xiaohe'

const cases: Array<{ pinyin: string; expected: string }> = [
  { pinyin: 'ai', expected: 'ad' },
  { pinyin: 'ang', expected: 'ah' },
  { pinyin: 'eng', expected: 'eg' },
  { pinyin: 'ong', expected: 'os' },
  { pinyin: 'zhong', expected: 'vs' },
  { pinyin: 'chuan', expected: 'ir' },
  { pinyin: 'shui', expected: 'uv' },
  { pinyin: 'xiong', expected: 'xs' },
  { pinyin: 'xu', expected: 'xv' },
  { pinyin: 'yuan', expected: 'yr' },
  { pinyin: 'er', expected: 'er' },
]

cases.forEach(({ pinyin, expected }) => {
  const { initial, final } = parsePinyinParts(pinyin)
  const actual = pinyinToShuangpin(pinyin, initial, final)
  assert.equal(actual, expected, `${pinyin}: expected ${expected}, got ${actual}`)
})

console.log(`Mapping checks passed: ${cases.length} cases`)
