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

  // 一次性获取所有拼音信息（包含声母和韵母）
  const result = pinyin(text, {
    type: 'all',
    toneType: 'none',
    v: true,
  })

  for (const item of result) {
    const char = item.origin

    // 跳过非汉字字符（标点、空格等）
    if (!/[\u4e00-\u9fa5]/.test(char)) {
      continue
    }

    const py = item.pinyin || ''
    const initial = item.initial || ''
    const final = item.final || ''

    const shuangpin = pinyinToShuangpin(py, initial, final)

    queue.push({
      char,
      pinyin: py,
      autoPinyin: py,
      initial,
      final,
      shuangpin,
      pinyinSource: 'auto',
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
