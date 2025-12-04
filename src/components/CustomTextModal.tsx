'use client'

import { useState } from 'react'

interface CustomTextModalProps {
  onStart: (text: string, mode: 'normal' | 'follow') => void
  onClose: () => void
  darkMode: boolean
}

export default function CustomTextModal({ onStart, onClose, darkMode }: CustomTextModalProps) {
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'normal' | 'follow'>('normal')

  const theme = darkMode
    ? { bg: 'bg-gray-900', card: 'bg-gray-800', text: 'text-white', textMuted: 'text-gray-400', border: 'border-gray-700', input: 'bg-gray-700 border-gray-600' }
    : { bg: 'bg-gray-100', card: 'bg-white', text: 'text-gray-900', textMuted: 'text-gray-500', border: 'border-gray-300', input: 'bg-white border-gray-300' }

  const handleStart = () => {
    const cleanText = text.trim()
    if (cleanText) {
      onStart(cleanText, mode)
      onClose()
    }
  }

  // 预设文本示例
  const examples = [
    { label: '古诗', text: '床前明月光疑是地上霜举头望明月低头思故乡' },
    { label: '科技', text: '人工智能正在改变我们的生活方式和工作模式' },
    { label: '日常', text: '今天天气真不错适合出去走走' },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.card} rounded-2xl max-w-lg w-full`}>
        {/* 头部 */}
        <div className={`p-4 sm:p-6 border-b ${theme.border} flex justify-between items-center`}>
          <h2 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>📝 自定义文本</h2>
          <button onClick={onClose} className={`${theme.textMuted} hover:${theme.text} text-2xl`}>×</button>
        </div>

        <div className="p-4 sm:p-6">
          {/* 文本输入 */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="粘贴或输入你想练习的文本...&#10;&#10;支持中文、英文、数字混合文本"
            className={`w-full p-3 rounded-lg border ${theme.input} ${theme.text} focus:border-blue-500 focus:outline-none resize-none`}
            rows={6}
            autoFocus
          />

          {/* 字数统计 */}
          <div className={`text-right text-sm ${theme.textMuted} mt-1`}>
            {text.length} 字
          </div>

          {/* 快速示例 */}
          <div className="mt-3">
            <span className={`text-sm ${theme.textMuted}`}>快速填充：</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setText(ex.text)}
                  className={`px-3 py-1 text-sm rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${theme.text}`}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* 模式选择 */}
          <div className="mt-4">
            <span className={`text-sm ${theme.textMuted}`}>练习模式：</span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setMode('normal')}
                className={`flex-1 py-2 rounded-lg text-sm transition ${
                  mode === 'normal' ? 'bg-blue-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                💡 普通模式
                <div className={`text-xs ${mode === 'normal' ? 'text-blue-200' : theme.textMuted}`}>逐字练习，显示提示</div>
              </button>
              <button
                onClick={() => setMode('follow')}
                className={`flex-1 py-2 rounded-lg text-sm transition ${
                  mode === 'follow' ? 'bg-green-600 text-white' : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                📖 跟打模式
                <div className={`text-xs ${mode === 'follow' ? 'text-green-200' : theme.textMuted}`}>显示原文，照着打</div>
              </button>
            </div>
          </div>

          {/* 开始按钮 */}
          <button
            onClick={handleStart}
            disabled={!text.trim()}
            className={`w-full mt-4 py-3 rounded-lg font-bold transition ${
              text.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            开始练习
          </button>
        </div>
      </div>
    </div>
  )
}
