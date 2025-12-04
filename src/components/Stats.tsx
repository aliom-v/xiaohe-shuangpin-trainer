'use client'

import { useEffect, useState } from 'react'
import { getPracticeStats, getFrequentErrors, getWeakFinals, ErrorRecord, PracticeStats } from '@/lib/learning'
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

  useEffect(() => {
    setStats(getPracticeStats())
    setErrors(getFrequentErrors(10))
    setWeakFinals(getWeakFinals())
  }, [])

  const theme = darkMode ? {
    bg: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-white',
    textMuted: 'text-gray-400',
    border: 'border-gray-700',
  } : {
    bg: 'bg-gray-100',
    card: 'bg-white',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    border: 'border-gray-300',
  }

  // 找到韵母名称
  const getFinalName = (key: string) => {
    const entry = Object.entries(finalMap).find(([_, v]) => v === key)
    return entry ? entry[0] : key
  }

  const handlePracticeErrors = () => {
    if (errors.length > 0) {
      const chars = errors.map(e => e.char).join('')
      onPracticeErrors(chars)
      onClose()
    }
  }

  if (!stats) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.card} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto`}>
        <div className={`p-6 border-b ${theme.border} flex justify-between items-center`}>
          <h2 className={`text-2xl font-bold ${theme.text}`}>练习统计</h2>
          <button onClick={onClose} className={`${theme.textMuted} hover:${theme.text} text-2xl`}>×</button>
        </div>

        <div className="p-6">
          {/* 总体统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4 text-center`}>
              <div className="text-3xl font-bold text-blue-500">{stats.totalChars}</div>
              <div className={`text-sm ${theme.textMuted}`}>总字数</div>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4 text-center`}>
              <div className="text-3xl font-bold text-green-500">
                {stats.totalChars > 0 ? ((1 - stats.totalErrors / stats.totalChars) * 100).toFixed(1) : 0}%
              </div>
              <div className={`text-sm ${theme.textMuted}`}>准确率</div>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4 text-center`}>
              <div className="text-3xl font-bold text-purple-500">{stats.sessions}</div>
              <div className={`text-sm ${theme.textMuted}`}>练习次数</div>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4 text-center`}>
              <div className="text-3xl font-bold text-orange-500">
                {Math.floor(stats.totalTime / 60)}
              </div>
              <div className={`text-sm ${theme.textMuted}`}>总时长(分)</div>
            </div>
          </div>

          {/* 高频错误字 */}
          <h3 className={`font-bold mb-3 ${theme.text}`}>高频错误字</h3>
          {errors.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {errors.map((e, i) => (
                  <div
                    key={i}
                    className={`${darkMode ? 'bg-red-900/30' : 'bg-red-100'} px-3 py-2 rounded-lg`}
                  >
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
                  <div
                    key={key}
                    className={`${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'} px-3 py-2 rounded-lg`}
                  >
                    <span className="font-mono text-lg">{key}</span>
                    <span className={`text-xs ml-2 ${theme.textMuted}`}>
                      ({getFinalName(key)}) {count}次错误
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className={theme.textMuted}>暂无数据</p>
          )}
        </div>

        <div className={`p-6 border-t ${theme.border}`}>
          <button
            onClick={() => {
              if (confirm('确定要清除所有练习记录吗？')) {
                localStorage.removeItem('shuangpin_errors')
                localStorage.removeItem('shuangpin_stats')
                setStats({ totalChars: 0, totalErrors: 0, totalTime: 0, sessions: 0, lastPractice: 0 })
                setErrors([])
                setWeakFinals({})
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
