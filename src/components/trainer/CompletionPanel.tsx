import { memo } from 'react'
import type { Theme } from '@/hooks/useTheme'

interface CompletionPanelProps {
  theme: Theme
  stats: { correct: number; errors: number }
  isTimedMode: boolean
  timeLeft: number
  autoNext: boolean
  speed: number
  shareUrl: string
  onOpenStats: () => void
  onOpenPracticeMode: () => void
}

function CompletionPanelComponent({
  theme,
  stats,
  isTimedMode,
  timeLeft,
  autoNext,
  speed,
  shareUrl,
  onOpenStats,
  onOpenPracticeMode,
}: CompletionPanelProps) {
  const accuracy = stats.correct + stats.errors > 0
    ? ((stats.correct / (stats.correct + stats.errors)) * 100).toFixed(1)
    : '0'

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('链接已复制！分享给朋友一起练习吧')
  }

  return (
    <div className={`${theme.card} rounded-xl p-4 sm:p-6 mt-4`}>
      <div className="text-3xl sm:text-4xl mb-4 text-center">
        {isTimedMode && timeLeft <= 0 ? '⏰ 时间到！' : '🎉 完成！'}
      </div>

      {/* 详细统计卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className={`${theme.statCard} rounded-lg p-3 text-center`}>
          <div className="text-2xl font-bold text-blue-500">{stats.correct}</div>
          <div className={`text-xs ${theme.textMuted}`}>正确字数</div>
        </div>
        <div className={`${theme.statCard} rounded-lg p-3 text-center`}>
          <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
          <div className={`text-xs ${theme.textMuted}`}>错误次数</div>
        </div>
        <div className={`${theme.statCard} rounded-lg p-3 text-center`}>
          <div className="text-2xl font-bold text-green-500">{accuracy}%</div>
          <div className={`text-xs ${theme.textMuted}`}>准确率</div>
        </div>
        <div className={`${theme.statCard} rounded-lg p-3 text-center`}>
          <div className="text-2xl font-bold text-purple-500">{speed}</div>
          <div className={`text-xs ${theme.textMuted}`}>字/分钟</div>
        </div>
      </div>

      {/* 学习建议 */}
      {stats.errors > stats.correct * 0.3 && (
        <div className={`${theme.highlightYellow} rounded-lg p-3 mb-4 text-sm`}>
          💡 <span className={theme.textMuted}>建议：错误率较高，可以试试</span>
          <button onClick={onOpenPracticeMode} className="text-blue-500 ml-1 underline">专项练习</button>
          <span className={theme.textMuted}>，针对薄弱环节强化</span>
        </div>
      )}

      {autoNext && !isTimedMode && (
        <p className="text-purple-400 text-center text-sm mb-3">1.5秒后自动加载下一段...</p>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-center gap-3">
        <button
          onClick={handleShare}
          className={`px-4 py-1.5 text-sm rounded-lg ${theme.btn}`}
        >
          🔗 分享
        </button>
        <button
          onClick={onOpenStats}
          className={`px-4 py-1.5 text-sm rounded-lg ${theme.btn}`}
        >
          📊 查看统计
        </button>
      </div>
    </div>
  )
}

export const CompletionPanel = memo(CompletionPanelComponent)
