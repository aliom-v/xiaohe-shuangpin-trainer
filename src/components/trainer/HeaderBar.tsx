import { memo } from 'react'
import type { Theme } from '@/hooks/useTheme'

interface HeaderBarProps {
  theme: Theme
  darkMode: boolean
  autoNext: boolean
  soundEnabled: boolean
  onToggleTutorial: () => void
  onToggleStats: () => void
  onToggleLookup: () => void
  onToggleAutoNext: () => void
  onToggleSound: () => void
  onToggleDarkMode: () => void
}

function HeaderBarComponent({
  theme,
  darkMode,
  autoNext,
  soundEnabled,
  onToggleTutorial,
  onToggleStats,
  onToggleLookup,
  onToggleAutoNext,
  onToggleSound,
  onToggleDarkMode,
}: HeaderBarProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div>
        <h1 className="text-lg sm:text-2xl font-bold">小鹤双拼练习器</h1>
        <p className={`text-xs sm:text-base ${theme.textMuted}`}>Xiaohe Shuangpin Trainer</p>
      </div>
      <div className="flex gap-1 sm:gap-2">
        <button
          onClick={onToggleTutorial}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`}
          title="教程"
          aria-label="打开教程"
        >
          📖
        </button>
        <button
          onClick={onToggleStats}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`}
          title="统计"
          aria-label="查看统计"
        >
          📊
        </button>
        <button
          onClick={onToggleLookup}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`}
          title="双拼查询"
          aria-label="双拼查询"
        >
          🔍
        </button>
        <button
          onClick={onToggleAutoNext}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${autoNext ? 'bg-purple-100 dark:bg-purple-600 text-purple-700 dark:text-white border border-purple-300 dark:border-purple-500' : theme.btn}`}
          title="自动下一个"
          aria-label={autoNext ? '关闭自动下一个' : '开启自动下一个'}
        >
          {autoNext ? '🔄' : '⏸️'}
        </button>
        <button
          onClick={onToggleSound}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`}
          aria-label={soundEnabled ? '关闭声音' : '开启声音'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
        <button
          onClick={onToggleDarkMode}
          className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`}
          aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  )
}

export const HeaderBar = memo(HeaderBarComponent)
