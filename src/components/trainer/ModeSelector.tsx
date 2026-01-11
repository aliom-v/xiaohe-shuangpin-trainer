import { memo } from 'react'
import type { Theme } from '@/hooks/useTheme'
import type { LearningMode } from '@/hooks/useTrainerSettings'
import { getSoundPacks, playKeySound } from '@/lib/sound'

interface ModeSelectorProps {
  theme: Theme
  // 模式相关
  learningMode: LearningMode
  setLearningMode: (mode: LearningMode) => void
  isTimedMode: boolean
  setIsTimedMode: (v: boolean) => void
  timedDuration: number
  setTimedDuration: (v: number) => void
  timeLeft: number
  setTimeLeft: (v: number) => void
  // 设置相关
  allowShortFullPinyin: boolean
  setAllowShortFullPinyin: (fn: (v: boolean) => boolean) => void
  soundPackId: string
  setSoundPackId: (v: string) => void
  keyVolume: number
  setKeyVolume: (v: number) => void
  successVolume: number
  setSuccessVolume: (v: number) => void
  errorVolume: number
  setErrorVolume: (v: number) => void
  soundEnabled: boolean
  // 状态相关
  isStarted: boolean
  isComplete: boolean
  speed: number
  // 回调
  onOpenPracticeMode: () => void
}

function ModeSelectorComponent({
  theme,
  learningMode,
  setLearningMode,
  isTimedMode,
  setIsTimedMode,
  timedDuration,
  setTimedDuration,
  timeLeft,
  setTimeLeft,
  allowShortFullPinyin,
  setAllowShortFullPinyin,
  soundPackId,
  setSoundPackId,
  keyVolume,
  setKeyVolume,
  successVolume,
  setSuccessVolume,
  errorVolume,
  setErrorVolume,
  soundEnabled,
  isStarted,
  isComplete,
  speed,
  onOpenPracticeMode,
}: ModeSelectorProps) {
  return (
    <div className={`${theme.card} rounded-xl p-2 sm:p-3 mb-4 flex flex-wrap gap-1.5 sm:gap-2 items-center`}>
      <span className={`text-xs sm:text-sm ${theme.textMuted}`}>模式:</span>
      <button
        onClick={() => { setLearningMode('hint'); setIsTimedMode(false) }}
        className={`group relative px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${learningMode === 'hint' && !isTimedMode ? 'bg-blue-600 text-white' : theme.btn}`}
        title="显示拼音和双拼提示，键盘高亮下一个键"
      >
        💡 <span className="hidden sm:inline">提示</span>
      </button>
      <button
        onClick={() => { setLearningMode('blind'); setIsTimedMode(false) }}
        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${learningMode === 'blind' && !isTimedMode ? 'bg-blue-600 text-white' : theme.btn}`}
        title="只显示汉字，隐藏双拼提示"
      >
        🙈 <span className="hidden sm:inline">盲打</span>
      </button>
      {/* 限时模式 - 可选时长 */}
      <div className="relative group">
        <button
          onClick={() => { setIsTimedMode(true); setTimeLeft(timedDuration) }}
          className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${isTimedMode ? 'bg-orange-600 text-white' : theme.btn}`}
          title="限时挑战模式"
        >
          ⏱️ <span className="hidden sm:inline">{timedDuration}秒</span>
        </button>
        {/* 时长选择下拉 */}
        <div className={`absolute top-full left-0 mt-1 ${theme.card} rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10`}>
          {[30, 60, 120, 300].map(sec => (
            <button
              key={sec}
              onClick={() => { setTimedDuration(sec); setTimeLeft(sec); setIsTimedMode(true) }}
              className={`block w-full px-3 py-1 text-xs text-left hover:bg-blue-500 hover:text-white ${timedDuration === sec ? 'bg-blue-500 text-white' : ''}`}
            >
              {sec < 60 ? `${sec}秒` : `${sec / 60}分钟`}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={onOpenPracticeMode}
        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${theme.btn}`}
        title="专项练习特定声母/韵母"
      >
        🎯 <span className="hidden sm:inline">专项</span>
      </button>
      <button
        onClick={() => setAllowShortFullPinyin(s => !s)}
        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${allowShortFullPinyin ? 'bg-green-600 text-white' : theme.btn}`}
        title="允许 1-2 字母全拼输入"
      >
        🔤 <span className="hidden sm:inline">1-2全拼</span>
      </button>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-[10px] sm:text-xs ${theme.textMuted}`}>音效</span>
        <select
          value={soundPackId}
          onChange={(e) => setSoundPackId(e.target.value)}
          className={`px-2 py-1 rounded-lg text-xs sm:text-sm border ${theme.input} ${theme.text}`}
          title="选择键盘音效包"
          aria-label="选择键盘音效包"
        >
          {getSoundPacks().map(pack => (
            <option key={pack.id} value={pack.id}>{pack.name}</option>
          ))}
        </select>
        <button
          onClick={() => { if (soundEnabled) playKeySound() }}
          className={`px-2 py-1 rounded-lg text-xs sm:text-sm transition ${theme.btn}`}
          title="试听当前音效"
        >
          ▶
        </button>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] sm:text-xs ${theme.textMuted}`}>键音</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={keyVolume}
            onChange={(e) => setKeyVolume(Number(e.target.value))}
            className="w-16 sm:w-20 accent-blue-500"
            title="调整键音音量"
            aria-label="键音音量"
          />
          <span className={`text-[10px] sm:text-xs ${theme.textMuted} w-9 text-right`}>
            {Math.round(keyVolume * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] sm:text-xs ${theme.textMuted}`}>成功</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={successVolume}
            onChange={(e) => setSuccessVolume(Number(e.target.value))}
            className="w-16 sm:w-20 accent-green-500"
            title="调整成功音量"
            aria-label="成功音量"
          />
          <span className={`text-[10px] sm:text-xs ${theme.textMuted} w-9 text-right`}>
            {Math.round(successVolume * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] sm:text-xs ${theme.textMuted}`}>错误</span>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={errorVolume}
            onChange={(e) => setErrorVolume(Number(e.target.value))}
            className="w-16 sm:w-20 accent-red-500"
            title="调整错误音量"
            aria-label="错误音量"
          />
          <span className={`text-[10px] sm:text-xs ${theme.textMuted} w-9 text-right`}>
            {Math.round(errorVolume * 100)}%
          </span>
        </div>
      </div>
      {/* 限时进度条 */}
      {isTimedMode && isStarted && !isComplete && (
        <div className="ml-auto flex items-center gap-2">
          <div className={`w-20 sm:w-32 h-2 rounded-full ${theme.bar}`}>
            <div
              className={`h-full rounded-full transition-all ${timeLeft <= 10 ? 'bg-red-500' : 'bg-orange-400'}`}
              style={{ width: `${(timeLeft / timedDuration) * 100}%` }}
            />
          </div>
          <span className={`text-sm sm:text-lg font-mono ${timeLeft <= 10 ? 'text-red-500' : 'text-orange-400'}`}>
            {timeLeft}s
          </span>
        </div>
      )}
      {isStarted && !isComplete && !isTimedMode && (
        <span className={`ml-auto text-xs sm:text-sm ${theme.textMuted}`}>
          {speed}字/分
        </span>
      )}
    </div>
  )
}

export const ModeSelector = memo(ModeSelectorComponent)
