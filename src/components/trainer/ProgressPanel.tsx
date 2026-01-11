import { memo } from 'react'
import type { Theme } from '@/hooks/useTheme'
import type { CharInfo } from '@/lib/xiaohe'

interface ProgressPanelProps {
  theme: Theme
  queue: CharInfo[]
  currentIndex: number
  stats: { correct: number; errors: number }
  isError: boolean
  followMode: boolean
  isComplete: boolean
  inputText: string
}

function ProgressPanelComponent({
  theme,
  queue,
  currentIndex,
  stats,
  isError,
  followMode,
  isComplete,
  inputText,
}: ProgressPanelProps) {
  return (
    <div className={`${theme.card} rounded-xl p-4 mt-4`}>
      {followMode && !isComplete && (
        <div className={`mb-3 p-3 rounded-lg ${theme.codeBlock}`}>
          <div className={`text-xs ${theme.textMuted} mb-1`}>📖 原文（照着打）</div>
          <div className={`text-lg leading-relaxed ${theme.text}`}>
            {inputText}
          </div>
        </div>
      )}
      <div className="flex flex-wrap gap-1 text-lg justify-center">
        {queue.map((item, idx) => (
          <span
            key={idx}
            className={`px-1.5 py-0.5 rounded transition-all ${
              idx < currentIndex
                ? 'text-green-500 bg-green-500/10'
                : idx === currentIndex
                ? `text-yellow-500 bg-yellow-500/20 ${isError ? 'animate-shake' : ''}`
                : theme.textMuted
            }`}
          >
            {item.char}
          </span>
        ))}
      </div>
      <div className={`text-center mt-3 text-sm ${theme.textMuted}`}>
        进度: {currentIndex}/{queue.length} | 正确: {stats.correct} | 错误: {stats.errors}
        {followMode && <span className="ml-2 text-green-500">📖 跟打模式</span>}
      </div>
    </div>
  )
}

export const ProgressPanel = memo(ProgressPanelComponent)
