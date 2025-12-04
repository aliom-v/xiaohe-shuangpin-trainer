// 学习模块 - 专项练习、难度分级、错误分析

// 声母分类
export const initialGroups = {
  normal: {
    name: '普通声母',
    desc: '原位声母，键位不变',
    initials: ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'r', 'z', 'c', 's', 'y', 'w'],
  },
  special: {
    name: '变位声母',
    desc: 'zh→v, ch→i, sh→u',
    initials: ['zh', 'ch', 'sh'],
  },
}

// 韵母分类
export const finalGroups = {
  simple: {
    name: '单韵母',
    desc: '基础韵母',
    finals: ['a', 'o', 'e', 'i', 'u', 'v'],
  },
  compound: {
    name: '复韵母',
    desc: 'ai/ei/ao/ou 等',
    finals: ['ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'er'],
  },
  i_finals: {
    name: 'i开头韵母',
    desc: 'ia/ie/iu/ian 等',
    finals: ['ia', 'ie', 'iu', 'ian', 'iao', 'in', 'ing', 'iang', 'iong'],
  },
  u_finals: {
    name: 'u开头韵母',
    desc: 'ua/uo/ui/uan 等',
    finals: ['ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ong'],
  },
  v_finals: {
    name: 'ü韵母',
    desc: 've/vn 等',
    finals: ['ve', 'ue', 'vn'],
  },
}

// 零声母字练习
export const zeroInitialChars = [
  '啊', '阿', '哀', '爱', '安', '暗', '昂', '奥',
  '哦', '欧', '偶',
  '额', '恩', '二', '耳',
  '一', '衣', '医', '依',
  '五', '午', '舞', '物', '雾',
  '鱼', '雨', '语', '玉', '育',
]

// 常用字分级
export const charLevels = {
  beginner: {
    name: '入门',
    desc: '最常用500字',
    chars: '的一是不了在人有我他这个们中来上大为和国地到以说时要就出会可也你对生能而子那得于着下自之年过发后作里如果样学多都然没日行前等所同事关只种面门手与心高正外将公开已月小无方实吃使最长何但把很那情想见两理义世全才子者利实各入还用明今其头回代活消息',
  },
  intermediate: {
    name: '进阶',
    desc: '常用2000字',
    chars: '的一是不了在人有我他这个们中来上大为和国地到以说时要就出会可也你对生能而子那得于着下自之年过发后作里如果样学多都然没日行前等所同事关只种面门手与心高正外将公开已月小无方实吃使最长何但把很那情想见两理义世全才子者利实各入还用明今其头回代活消息电话问题工作经济社会发展改革建设政府领导干部群众基层农村城市企业市场产品技术服务管理质量安全环境资源能源交通教育科学文化卫生体育新闻媒体网络信息数据分析研究报告计划方案措施政策法律法规制度标准规范程序流程',
  },
  advanced: {
    name: '高级',
    desc: '包含生僻字',
    chars: '龋齲齰齯齮齭齬齫齪齩齨齧齦齥齤齣齢齡齠齟齞齝齜齛齚齙齘齗齖齕齔齓齒齑齐鑿鑾鑽鑼鑻鑺鑹鑸鑷鑶鑵鑴鑳鑲鑱鑰鑯鑮鑭鑬鑫鑪鑩鑨鑧鑦鑥鑤鑣鑢鑡鑠鑟鑞鑝鑜鑛鑚鑙鑘鑗鑖鑕鑔鑓鑒鑑鑐鑏鑎鑍鑌鑋鑊鑉鑈鑇鑆鑅鑄鑃鑂鑁鑀',
  },
}

// 专项练习文本生成
export const practiceTexts = {
  // 变位声母练习
  zhChSh: [
    '中国是一个伟大的国家',
    '这是什么东西',
    '吃饭睡觉打豆豆',
    '知识就是力量',
    '长城是中华民族的象征',
    '上海是国际大都市',
    '春天来了万物复苏',
    '诚实守信是做人的根本',
    '时间就是金钱',
    '生活需要仪式感',
  ],
  // 复杂韵母练习
  complexFinals: [
    '光明正大做人',
    '英雄所见略同',
    '风景这边独好',
    '情深意重难忘',
    '青山绿水好风光',
    '明月几时有把酒问青天',
    '长风破浪会有时',
    '人生得意须尽欢',
  ],
  // 零声母练习
  zeroInitial: [
    '爱我中华',
    '安全第一',
    '二话不说',
    '一心一意',
    '五湖四海',
    '鱼跃龙门',
    '恩重如山',
    '偶然相遇',
  ],
}

// 错误记录类型
export interface ErrorRecord {
  char: string
  pinyin: string
  shuangpin: string
  errorCount: number
  totalCount: number
  lastError: number // timestamp
}

// 从 localStorage 获取错误记录
export function getErrorRecords(): Record<string, ErrorRecord> {
  if (typeof window === 'undefined') return {}
  const data = localStorage.getItem('shuangpin_errors')
  return data ? JSON.parse(data) : {}
}

// 保存错误记录
export function saveErrorRecord(char: string, pinyin: string, shuangpin: string, isError: boolean) {
  if (typeof window === 'undefined') return
  const records = getErrorRecords()
  if (!records[char]) {
    records[char] = { char, pinyin, shuangpin, errorCount: 0, totalCount: 0, lastError: 0 }
  }
  records[char].totalCount++
  if (isError) {
    records[char].errorCount++
    records[char].lastError = Date.now()
  }
  localStorage.setItem('shuangpin_errors', JSON.stringify(records))
}

// 获取高频错误字
export function getFrequentErrors(limit = 10): ErrorRecord[] {
  const records = getErrorRecords()
  return Object.values(records)
    .filter(r => r.errorCount > 0)
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, limit)
}

// 获取薄弱韵母统计
export function getWeakFinals(): Record<string, number> {
  const records = getErrorRecords()
  const finals: Record<string, number> = {}
  Object.values(records).forEach(r => {
    if (r.errorCount > 0) {
      const final = r.shuangpin[1]
      finals[final] = (finals[final] || 0) + r.errorCount
    }
  })
  return finals
}

// 练习统计
export interface PracticeStats {
  totalChars: number
  totalErrors: number
  totalTime: number // seconds
  sessions: number
  lastPractice: number
}

export function getPracticeStats(): PracticeStats {
  if (typeof window === 'undefined') {
    return { totalChars: 0, totalErrors: 0, totalTime: 0, sessions: 0, lastPractice: 0 }
  }
  const data = localStorage.getItem('shuangpin_stats')
  return data ? JSON.parse(data) : { totalChars: 0, totalErrors: 0, totalTime: 0, sessions: 0, lastPractice: 0 }
}

export function updatePracticeStats(chars: number, errors: number, time: number) {
  if (typeof window === 'undefined') return
  const stats = getPracticeStats()
  stats.totalChars += chars
  stats.totalErrors += errors
  stats.totalTime += time
  stats.sessions++
  stats.lastPractice = Date.now()
  localStorage.setItem('shuangpin_stats', JSON.stringify(stats))
}
