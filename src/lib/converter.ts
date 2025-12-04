// ============================================
// 转换引擎 (The Pipeline)
// ============================================

import { pinyin } from 'pinyin-pro'
import { pinyinToShuangpin, CharInfo } from './xiaohe'

/**
 * 将汉字文本转换为练习队列
 */
export function convertTextToQueue(text: string): CharInfo[] {
  const queue: CharInfo[] = []
  
  // 获取每个字的拼音信息（包含声母和韵母）
  const result = pinyin(text, {
    type: 'array',
    toneType: 'none',
    v: true,
  })
  
  const initials = pinyin(text, {
    pattern: 'initial',
    type: 'array',
    toneType: 'none',
  })
  
  const finals = pinyin(text, {
    pattern: 'final',
    type: 'array',
    toneType: 'none',
    v: true,
  })
  
  const chars = text.split('')
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i]
    
    // 跳过非汉字字符（标点、空格等）
    if (!/[\u4e00-\u9fa5]/.test(char)) {
      continue
    }
    
    const py = result[i] || ''
    const initial = initials[i] || ''
    const final = finals[i] || ''
    
    const shuangpin = pinyinToShuangpin(py, initial, final)
    
    queue.push({
      char,
      pinyin: py,
      initial,
      final,
      shuangpin,
    })
  }
  
  return queue
}

// 从 texts.ts 导入文本库
export {
  getAllTexts,
  getRandomText,
  getRandomTextByCategory,
  getCategoryNames,
  textCategories,
} from './texts'

// 兼容旧接口
import { getAllTexts } from './texts'
export const presetTexts = getAllTexts()
