import { memo } from 'react'
import type { Theme } from '@/hooks/useTheme'
import type { LearningMode } from '@/hooks/useTrainerSettings'
import type { CharInfo } from '@/lib/xiaohe'

interface CurrentCharPanelProps {
  theme: Theme
  current: CharInfo
  currentIndex: number
  inputBuffer: string
  isError: boolean
  wrongKey: string | null
  correctKey: string | null
  learningMode: LearningMode
  // 拼音编辑相关
  isEditingPinyin: boolean
  pinyinDraft: string
  pinyinEditError: string
  setPinyinDraft: (v: string) => void
  onOpenPinyinEditor: (pinyin: string) => void
  onApplyPinyinEdit: (index: number, draft: string) => void
  onResetPinyinEdit: (index: number) => void
  onCancelPinyinEdit: () => void
}

function CurrentCharPanelComponent({
  theme,
  current,
  currentIndex,
  inputBuffer,
  isError,
  wrongKey,
  correctKey,
  learningMode,
  isEditingPinyin,
  pinyinDraft,
  pinyinEditError,
  setPinyinDraft,
  onOpenPinyinEditor,
  onApplyPinyinEdit,
  onResetPinyinEdit,
  onCancelPinyinEdit,
}: CurrentCharPanelProps) {
  return (
    <div className={`${theme.card} rounded-xl p-6 mt-4 text-center`}>
      <div className="flex items-center justify-center gap-4 sm:gap-8">
        <div className="text-4xl sm:text-6xl">{current.char}</div>
        <div className="text-left">
          <div className={`text-sm sm:text-base ${theme.textMuted} flex items-center gap-2`}>
            <span>拼音:</span>
            <span className={theme.text}>{current.pinyin}</span>
            <button
              onClick={() => onOpenPinyinEditor(current.pinyin)}
              className={`text-xs px-2 py-0.5 rounded ${theme.btnSmall}`}
              title="修改拼音（多音字校正）"
            >
              ✏️
            </button>
            {current.pinyinSource === 'manual' && (
              <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded ${theme.tagManual}`}>
                手动
              </span>
            )}
          </div>
          {isEditingPinyin && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <input
                type="text"
                value={pinyinDraft}
                onChange={(e) => setPinyinDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onApplyPinyinEdit(currentIndex, pinyinDraft)
                }}
                className={`px-2 py-1 rounded border ${theme.input} ${theme.text} w-32`}
                placeholder="输入拼音"
              />
              <button
                onClick={() => onApplyPinyinEdit(currentIndex, pinyinDraft)}
                className="px-2 py-1 rounded bg-blue-600 text-white"
              >
                应用
              </button>
              {current.autoPinyin && current.pinyinSource === 'manual' && (
                <button
                  onClick={() => onResetPinyinEdit(currentIndex)}
                  className={`px-2 py-1 rounded ${theme.btnSmall}`}
                >
                  重置
                </button>
              )}
              <button
                onClick={onCancelPinyinEdit}
                className={`px-2 py-1 rounded ${theme.btnSmall}`}
              >
                取消
              </button>
              {pinyinEditError && (
                <span className="text-red-400">{pinyinEditError}</span>
              )}
            </div>
          )}
          {learningMode !== 'blind' && (
            <div className={`text-sm sm:text-base ${theme.textMuted}`}>
              双拼: <span className="text-blue-500 font-mono text-lg sm:text-xl">
                <span className={inputBuffer ? 'text-green-500' : ''}>{current.shuangpin[0]}</span>
                <span>{current.shuangpin[1]}</span>
              </span>
            </div>
          )}
          <div className={`text-2xl sm:text-3xl font-mono mt-2 ${isError ? 'text-red-500' : theme.text}`}>
            {inputBuffer || '_'}
          </div>
          {/* 错误提示 */}
          {isError && wrongKey && correctKey && (
            <div className="text-xs sm:text-sm text-red-400 mt-1">
              你按了 <span className={`font-mono ${theme.errorHintWrong} px-1 rounded`}>{wrongKey}</span>，
              正确是 <span className={`font-mono ${theme.errorHintCorrect} px-1 rounded`}>{correctKey}</span>
              <span className={`ml-2 text-[10px] sm:text-xs ${theme.errorHintTarget}`}>目标 {current.shuangpin}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const CurrentCharPanel = memo(CurrentCharPanelComponent)
