// ============================================
// 小鹤双拼映射表 (Data Model)
// ============================================

// 声母映射：大部分原位，少数变位
export const initialMap: Record<string, string> = {
  b: 'b', p: 'p', m: 'm', f: 'f',
  d: 'd', t: 't', n: 'n', l: 'l',
  g: 'g', k: 'k', h: 'h',
  j: 'j', q: 'q', x: 'x',
  r: 'r', z: 'z', c: 'c', s: 's', y: 'y', w: 'w',
  // 变位声母
  zh: 'v',
  ch: 'i',
  sh: 'u',
}

// 韵母映射：小鹤双拼方案
export const finalMap: Record<string, string> = {
  a: 'a', o: 'o', e: 'e', i: 'i', u: 'u', v: 'v',
  ai: 'd', ei: 'w', ao: 'c', ou: 'z',
  an: 'j', en: 'f', ang: 'h', eng: 'g',
  ong: 's', iong: 's',
  er: 'r',
  ia: 'x', ie: 'p', iu: 'q', ian: 'm', iao: 'n', in: 'b', ing: 'k', iang: 'l',
  ua: 'x', uo: 'o', uai: 'k', ui: 'v', uan: 'r', un: 'y', uang: 'l',
  van: 'r', ve: 't', ue: 't', vn: 'y',
}

// 特殊整体音节（零声母处理）
export const specialSyllables: Record<string, string> = {
  a: 'aa', o: 'oo', e: 'ee',
  ai: 'ad', ei: 'ew', ao: 'ac', ou: 'oz',
  an: 'aj', en: 'ef', ang: 'ah', eng: 'eg', er: 'er',
}

export interface CharInfo {
  char: string
  pinyin: string
  autoPinyin?: string
  initial: string
  final: string
  shuangpin: string
  pinyinSource?: 'auto' | 'manual'
}

export function parsePinyinParts(pinyin: string): { initial: string; final: string } {
  const py = pinyin.toLowerCase().replace('u:', 'v').replace('ü', 'v')
  
  if (specialSyllables[py]) {
    return { initial: '', final: py }
  }
  
  const doubleInitials = ['zh', 'ch', 'sh']
  for (const di of doubleInitials) {
    if (py.startsWith(di)) {
      return { initial: di, final: py.slice(2) }
    }
  }
  
  const singleInitials = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w']
  for (const si of singleInitials) {
    if (py.startsWith(si)) {
      let final = py.slice(1)
      if (['j', 'q', 'x', 'y'].includes(si) && final.startsWith('u')) {
        final = `v${final.slice(1)}`
      }
      return { initial: si, final }
    }
  }
  
  return { initial: '', final: py }
}

/**
 * 将拼音转换为小鹤双拼编码
 */
export function pinyinToShuangpin(pinyin: string, initial: string, final: string): string {
  const py = pinyin.toLowerCase()
  
  // 1. 检查是否是特殊整体音节（零声母）
  if (specialSyllables[py]) {
    return specialSyllables[py]
  }
  
  // 2. 零声母处理：韵母首字母 + 韵母键
  if (!initial || initial === '') {
    const firstLetter = final.charAt(0)
    const finalKey = finalMap[final] || final.charAt(0)
    return firstLetter + finalKey
  }
  
  // 3. 正常声母 + 韵母
  const initialKey = initialMap[initial] || initial
  const finalKey = finalMap[final] || final
  
  return initialKey + finalKey
}
