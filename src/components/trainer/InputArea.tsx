import { memo } from 'react'
import type { Theme } from '@/hooks/useTheme'

type TextSource = 'local' | 'online'

interface InputAreaProps {
  theme: Theme
  inputText: string
  isLoading: boolean
  textSource: TextSource
  onStartPractice: (text: string) => void
  onRandomText: () => void
  onOpenCustomText: () => void
  setInputText: (text: string) => void
  setTextSource: (source: TextSource) => void
}

function InputAreaComponent({
  theme,
  inputText,
  isLoading,
  textSource,
  onStartPractice,
  onRandomText,
  onOpenCustomText,
  setInputText,
  setTextSource,
}: InputAreaProps) {
  return (
    <div className={`${theme.card} p-4 mt-4`}>
      <textarea
        className={`w-full p-3 ${theme.input} focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none`}
        rows={2}
        placeholder="在此粘贴要练习的文本，或点击随机文本..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        aria-label="练习文本输入"
      />
      <div className="flex flex-wrap gap-3 mt-3">
        <button
          onClick={() => onStartPractice(inputText)}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          开始练习
        </button>
        <button
          onClick={onRandomText}
          disabled={isLoading}
          className={`px-5 py-2 rounded-lg transition ${theme.btn} ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? '⏳ 加载中...' : '🎲 随机文本'}
        </button>
        <button
          onClick={onOpenCustomText}
          className={`px-5 py-2 rounded-lg transition ${theme.btn}`}
        >
          📝 自定义
        </button>
        <button
          onClick={() => setTextSource(textSource === 'local' ? 'online' : 'local')}
          className={`px-5 py-2 rounded-lg transition ${textSource === 'online' ? 'bg-green-600 text-white' : theme.btn}`}
        >
          {textSource === 'online' ? '🌐 在线' : '📦 本地'}
        </button>
      </div>
      {/* 快捷键提示 */}
      <div className={`mt-3 text-xs ${theme.textMuted} flex flex-wrap gap-3`}>
        <span><kbd className={`px-1.5 py-0.5 rounded ${theme.kbd}`}>Space</kbd> 随机文本</span>
        <span><kbd className={`px-1.5 py-0.5 rounded ${theme.kbd}`}>Tab</kbd> 跳过当前字</span>
        <span><kbd className={`px-1.5 py-0.5 rounded ${theme.kbd}`}>Esc</kbd> 结束练习</span>
      </div>
    </div>
  )
}

export const InputArea = memo(InputAreaComponent)
