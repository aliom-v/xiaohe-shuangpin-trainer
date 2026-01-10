'use client'

import { useEffect, useState } from 'react'
import {
  getPracticeStats,
  getFrequentErrors,
  getWeakFinals,
  getDailyRecords,
  getUnlockedAchievements,
  getSmartRecommendation,
  getStreak,
  ErrorRecord,
  PracticeStats,
  DailyRecord,
  Achievement,
} from '@/lib/learning'
import { useTheme } from '@/hooks/useTheme'
import { finalMap } from '@/lib/xiaohe'

interface StatsProps {
  onClose: () => void
  onPracticeErrors: (chars: string) => void
  darkMode: boolean
}

export default function Stats({ onClose, onPracticeErrors, darkMode }: StatsProps) {
  const [stats, setStats] = useState<PracticeStats | null>(null)
  const [errors, setErrors] = useState<ErrorRecord[]>([])
  const [weakFinals, setWeakFinals] = useState<Record<string, number>>({})
  const [daily, setDaily] = useState<DailyRecord[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [recommendation, setRecommendation] = useState<{ type: string; keys: string[]; reason: string } | null>(null)
  const [tab, setTab] = useState<'stats' | 'history' | 'achievements'>('stats')

  useEffect(() => {
    setStats(getPracticeStats())
    setErrors(getFrequentErrors(10))
    setWeakFinals(getWeakFinals())
    setDaily(getDailyRecords())
    setAchievements(getUnlockedAchievements())
    setRecommendation(getSmartRecommendation())
  }, [])

  const theme = useTheme(darkMode)

  const getFinalName = (key: string) => {
    const entry = Object.entries(finalMap).find(([_, v]) => v === key)
    return entry ? entry[0] : key
  }

  const handlePracticeErrors = () => {
    if (errors.length > 0) {
      const chars = errors.map((e) => e.char).join('')
      onPracticeErrors(chars)
      onClose()
    }
  }

  if (!stats) return null

  // 计算最高速度
  const maxSpeed = daily.length > 0 ? Math.max(...daily.map((d) => d.avgSpeed)) : 0
  const streak = daily.length > 0 ? getStreak(daily) : 0

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.card} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto scrollbar-hide`}>
        {/* 头部 */}
        <div className={`p-4 sm:p-6 border-b ${theme.border} flex justify-between items-center`}>
          <h2 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>练习统计</h2>
          <button onClick={onClose} className={`${theme.textMuted} hover:${theme.text} text-2xl`}>
            ×
          </button>
        </div>

        {/* Tab 切换 */}
        <div className={`flex border-b ${theme.border}`}>
          {[
            { key: 'stats', label: '📊 统计' },
            { key: 'history', label: '📈 历史' },
            { key: 'achievements', label: '🏆 成就' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={`flex-1 py-3 text-sm sm:text-base transition ${
                tab === t.key
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : theme.textMuted
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {/* 统计 Tab */}
          {tab === 'stats' && (
            <>
              {/* 智能推荐 */}
              {recommendation && (
                <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} border border-blue-500/30`}>
                  <div className="flex items-center gap-2">
                    <span>💡</span>
                    <span className={theme.text}>{recommendation.reason}</span>
                  </div>
                </div>
              )}

              {/* 总体统计 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <StatCard label="总字数" value={stats.totalChars} color="blue" darkMode={darkMode} />
                <StatCard
                  label="准确率"
                  value={`${stats.totalChars > 0 ? ((1 - stats.totalErrors / (stats.totalChars + stats.totalErrors)) * 100).toFixed(1) : 0}%`}
                  color="green"
                  darkMode={darkMode}
                />
                <StatCard label="练习次数" value={stats.sessions} color="purple" darkMode={darkMode} />
                <StatCard label="连续天数" value={`${streak}天`} color="orange" darkMode={darkMode} />
              </div>

              {/* 高频错误字 */}
              <h3 className={`font-bold mb-3 ${theme.text}`}>高频错误字</h3>
              {errors.length > 0 ? (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {errors.map((e, i) => (
                      <div key={i} className={`${darkMode ? 'bg-red-900/30' : 'bg-red-100'} px-3 py-2 rounded-lg`}>
                        <span className="text-xl">{e.char}</span>
                        <span className={`text-xs ml-2 ${theme.textMuted}`}>
                          {e.pinyin}→{e.shuangpin} ({e.errorCount}次)
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handlePracticeErrors}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm mb-6"
                  >
                    专练这些错误字
                  </button>
                </>
              ) : (
                <p className={`${theme.textMuted} mb-6`}>暂无错误记录，继续保持！</p>
              )}

              {/* 薄弱韵母 */}
              <h3 className={`font-bold mb-3 ${theme.text}`}>薄弱韵母</h3>
              {Object.keys(weakFinals).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(weakFinals)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 8)
                    .map(([key, count]) => (
                      <div key={key} className={`${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'} px-3 py-2 rounded-lg`}>
                        <span className="font-mono text-lg">{key}</span>
                        <span className={`text-xs ml-2 ${theme.textMuted}`}>
                          {getFinalName(key)} {count}次
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className={theme.textMuted}>暂无数据</p>
              )}
            </>
          )}

          {/* 历史 Tab */}
          {tab === 'history' && (
            <>
              <h3 className={`font-bold mb-4 ${theme.text}`}>最近练习记录</h3>
              {daily.length > 0 ? (
                <>
                  {/* 简易柱状图 */}
                  <div className="flex items-end gap-1 h-32 mb-4">
                    {daily.slice(0, 14).reverse().map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t"
                          style={{ height: `${maxSpeed > 0 ? (d.avgSpeed / maxSpeed) * 100 : 0}%`, minHeight: d.avgSpeed > 0 ? '4px' : '0' }}
                          title={`${d.date}: ${d.avgSpeed}字/分`}
                        />
                        <span className={`text-[8px] mt-1 ${theme.textMuted}`}>{d.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* 详细列表 */}
                  <div className="space-y-2 max-h-48 overflow-auto">
                    {daily.map((d, i) => (
                      <div key={i} className={`flex justify-between items-center p-2 rounded ${theme.bar}`}>
                        <span className={theme.text}>{d.date}</span>
                        <div className={`text-sm ${theme.textMuted}`}>
                          {d.chars}字 | {d.avgSpeed}字/分 | {d.sessions}次
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className={theme.textMuted}>暂无历史记录</p>
              )}
            </>
          )}

          {/* 成就 Tab */}
          {tab === 'achievements' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.id}
                  className={`p-3 rounded-lg text-center transition ${
                    a.unlocked
                      ? darkMode ? 'bg-green-900/30 border border-green-500/30' : 'bg-green-100 border border-green-300'
                      : darkMode ? 'bg-gray-700/50 opacity-50' : 'bg-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{a.icon}</div>
                  <div className={`font-bold text-sm ${a.unlocked ? theme.text : theme.textMuted}`}>{a.name}</div>
                  <div className={`text-xs ${theme.textMuted}`}>{a.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className={`p-4 sm:p-6 border-t ${theme.border}`}>
          <button
            onClick={() => {
              if (confirm('确定要清除所有练习记录吗？')) {
                localStorage.removeItem('shuangpin_errors')
                localStorage.removeItem('shuangpin_stats')
                localStorage.removeItem('shuangpin_daily')
                localStorage.removeItem('shuangpin_achievements')
                setStats({ totalChars: 0, totalErrors: 0, totalTime: 0, sessions: 0, lastPractice: 0 })
                setErrors([])
                setWeakFinals({})
                setDaily([])
                setAchievements(getUnlockedAchievements())
              }
            }}
            className={`text-sm ${theme.textMuted} hover:text-red-500`}
          >
            清除所有记录
          </button>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, darkMode }: { label: string; value: string | number; color: string; darkMode: boolean }) {
  const colors: Record<string, string> = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
  }
  return (
    <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-3 sm:p-4 text-center`}>
      <div className={`text-2xl sm:text-3xl font-bold ${colors[color]}`}>{value}</div>
      <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</div>
    </div>
  )
}
