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

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isFinite(value)
}

function safeParse<T>(data: string | null, fallback: T, validate: (value: unknown) => value is T): T {
  if (!data) return fallback
  try {
    const parsed = JSON.parse(data)
    return validate(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
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

const isErrorRecord = (value: unknown): value is ErrorRecord => {
  if (!isRecord(value)) return false
  return typeof value.char === 'string'
    && typeof value.pinyin === 'string'
    && typeof value.shuangpin === 'string'
    && isFiniteNumber(value.errorCount)
    && isFiniteNumber(value.totalCount)
    && isFiniteNumber(value.lastError)
}

const isErrorRecordMap = (value: unknown): value is Record<string, ErrorRecord> => {
  if (!isRecord(value)) return false
  return Object.values(value).every(isErrorRecord)
}

const isRecordStringNumberMap = (value: unknown): value is Record<string, number> => {
  if (!isRecord(value)) return false
  return Object.values(value).every(isFiniteNumber)
}

// 从 localStorage 获取错误记录
export function getErrorRecords(): Record<string, ErrorRecord> {
  if (typeof window === 'undefined') return {}
  return safeParse(localStorage.getItem('shuangpin_errors'), {}, isErrorRecordMap)
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

const isPracticeStats = (value: unknown): value is PracticeStats => {
  if (!isRecord(value)) return false
  return isFiniteNumber(value.totalChars)
    && isFiniteNumber(value.totalErrors)
    && isFiniteNumber(value.totalTime)
    && isFiniteNumber(value.sessions)
    && isFiniteNumber(value.lastPractice)
}

export function getPracticeStats(): PracticeStats {
  if (typeof window === 'undefined') {
    return { totalChars: 0, totalErrors: 0, totalTime: 0, sessions: 0, lastPractice: 0 }
  }
  return safeParse(
    localStorage.getItem('shuangpin_stats'),
    { totalChars: 0, totalErrors: 0, totalTime: 0, sessions: 0, lastPractice: 0 },
    isPracticeStats
  )
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

// ============================================
// 历史记录（每日统计）
// ============================================

export interface DailyRecord {
  date: string // YYYY-MM-DD
  chars: number
  errors: number
  time: number // seconds
  sessions: number
  avgSpeed: number // 字/分钟
}

const isDailyRecord = (value: unknown): value is DailyRecord => {
  if (!isRecord(value)) return false
  return typeof value.date === 'string'
    && isFiniteNumber(value.chars)
    && isFiniteNumber(value.errors)
    && isFiniteNumber(value.time)
    && isFiniteNumber(value.sessions)
    && isFiniteNumber(value.avgSpeed)
}

const isDailyRecordList = (value: unknown): value is DailyRecord[] => {
  return Array.isArray(value) && value.every(isDailyRecord)
}

export function getDailyRecords(): DailyRecord[] {
  if (typeof window === 'undefined') return []
  return safeParse(localStorage.getItem('shuangpin_daily'), [], isDailyRecordList)
}

export function saveDailyRecord(chars: number, errors: number, time: number) {
  if (typeof window === 'undefined') return
  const today = new Date().toISOString().split('T')[0]
  const records = getDailyRecords()
  
  let todayRecord = records.find(r => r.date === today)
  if (!todayRecord) {
    todayRecord = { date: today, chars: 0, errors: 0, time: 0, sessions: 0, avgSpeed: 0 }
    records.push(todayRecord)
  }
  
  todayRecord.chars += chars
  todayRecord.errors += errors
  todayRecord.time += time
  todayRecord.sessions++
  todayRecord.avgSpeed = todayRecord.time > 0 ? Math.round(todayRecord.chars / (todayRecord.time / 60)) : 0
  
  // 只保留最近30天
  const sorted = records.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30)
  localStorage.setItem('shuangpin_daily', JSON.stringify(sorted))
}

// ============================================
// 成就系统
// ============================================

export interface Achievement {
  id: string
  name: string
  desc: string
  icon: string
  condition: (stats: PracticeStats, daily: DailyRecord[]) => boolean
  unlocked?: boolean
  unlockedAt?: number
}

export const achievements: Achievement[] = [
  { id: 'first_practice', name: '初出茅庐', desc: '完成第一次练习', icon: '🎯', condition: (s) => s.sessions >= 1 },
  { id: 'chars_100', name: '百字斩', desc: '累计练习100字', icon: '💯', condition: (s) => s.totalChars >= 100 },
  { id: 'chars_500', name: '五百壮士', desc: '累计练习500字', icon: '⚔️', condition: (s) => s.totalChars >= 500 },
  { id: 'chars_1000', name: '千字文', desc: '累计练习1000字', icon: '📜', condition: (s) => s.totalChars >= 1000 },
  { id: 'chars_5000', name: '五千大关', desc: '累计练习5000字', icon: '🏆', condition: (s) => s.totalChars >= 5000 },
  { id: 'chars_10000', name: '万字王', desc: '累计练习10000字', icon: '👑', condition: (s) => s.totalChars >= 10000 },
  { id: 'sessions_10', name: '坚持不懈', desc: '练习10次', icon: '💪', condition: (s) => s.sessions >= 10 },
  { id: 'sessions_50', name: '习惯养成', desc: '练习50次', icon: '🔥', condition: (s) => s.sessions >= 50 },
  { id: 'sessions_100', name: '百炼成钢', desc: '练习100次', icon: '🌟', condition: (s) => s.sessions >= 100 },
  { id: 'accuracy_90', name: '精准射手', desc: '单次准确率达到90%', icon: '🎯', condition: () => false }, // 特殊处理
  { id: 'speed_60', name: '飞速打字', desc: '速度达到60字/分钟', icon: '⚡', condition: () => false }, // 特殊处理
  { id: 'streak_3', name: '三天打鱼', desc: '连续练习3天', icon: '📅', condition: (_, d) => getStreak(d) >= 3 },
  { id: 'streak_7', name: '一周坚持', desc: '连续练习7天', icon: '🗓️', condition: (_, d) => getStreak(d) >= 7 },
  { id: 'streak_30', name: '月度达人', desc: '连续练习30天', icon: '🏅', condition: (_, d) => getStreak(d) >= 30 },
]

export function getStreak(daily: DailyRecord[]): number {
  if (daily.length === 0) return 0
  const sorted = [...daily].sort((a, b) => b.date.localeCompare(a.date))
  const today = new Date().toISOString().split('T')[0]
  
  let streak = 0
  let checkDate = new Date(today)
  
  for (const record of sorted) {
    const recordDate = record.date
    const expectedDate = checkDate.toISOString().split('T')[0]
    
    if (recordDate === expectedDate) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else if (recordDate < expectedDate) {
      break
    }
  }
  return streak
}

export function getUnlockedAchievements(): Achievement[] {
  if (typeof window === 'undefined') return []
  const stats = getPracticeStats()
  const daily = getDailyRecords()
  const unlockedIds = safeParse(localStorage.getItem('shuangpin_achievements'), {}, isRecordStringNumberMap)
  
  return achievements.map(a => ({
    ...a,
    unlocked: !!unlockedIds[a.id] || a.condition(stats, daily),
    unlockedAt: unlockedIds[a.id],
  }))
}

export function checkAndUnlockAchievements(accuracy?: number, speed?: number): Achievement[] {
  if (typeof window === 'undefined') return []
  const stats = getPracticeStats()
  const daily = getDailyRecords()
  const unlockedIds = safeParse(localStorage.getItem('shuangpin_achievements'), {}, isRecordStringNumberMap)
  
  const newlyUnlocked: Achievement[] = []
  
  for (const a of achievements) {
    if (unlockedIds[a.id]) continue
    
    let shouldUnlock = false
    if (a.id === 'accuracy_90' && accuracy && accuracy >= 90) shouldUnlock = true
    else if (a.id === 'speed_60' && speed && speed >= 60) shouldUnlock = true
    else if (a.condition(stats, daily)) shouldUnlock = true
    
    if (shouldUnlock) {
      unlockedIds[a.id] = Date.now()
      newlyUnlocked.push({ ...a, unlocked: true, unlockedAt: Date.now() })
    }
  }
  
  if (newlyUnlocked.length > 0) {
    localStorage.setItem('shuangpin_achievements', JSON.stringify(unlockedIds))
  }
  
  return newlyUnlocked
}

// ============================================
// 智能推荐
// ============================================

export function getSmartRecommendation(): { type: string; keys: string[]; reason: string } | null {
  const errors = getFrequentErrors(5)
  const weakFinals = getWeakFinals()
  
  if (errors.length === 0) return null
  
  // 找出最薄弱的韵母
  const sortedFinals = Object.entries(weakFinals).sort((a, b) => b[1] - a[1])
  if (sortedFinals.length > 0) {
    const [weakKey, count] = sortedFinals[0]
    if (count >= 3) {
      return {
        type: 'final',
        keys: [weakKey],
        reason: `韵母 "${weakKey}" 错误${count}次，建议专项练习`,
      }
    }
  }
  
  // 检查变位声母
  const zhChShErrors = errors.filter(e => ['v', 'i', 'u'].includes(e.shuangpin[0]))
  if (zhChShErrors.length >= 2) {
    return {
      type: 'initial',
      keys: ['v', 'i', 'u'],
      reason: 'zh/ch/sh 变位声母错误较多，建议专项练习',
    }
  }
  
  return null
}
