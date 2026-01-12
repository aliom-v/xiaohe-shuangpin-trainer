'use client'

import { practiceTexts } from '@/lib/learning'
import { useTheme } from '@/hooks/useTheme'

interface PracticeModeProps {
  onSelect: (text: string) => void
  onClose: () => void
  darkMode: boolean
}

const modes = [
  {
    id: 'zhChSh',
    name: '变位声母',
    desc: '专练 zh/ch/sh → v/i/u',
    icon: '🔄',
    texts: practiceTexts.zhChSh,
  },
  {
    id: 'complexFinals',
    name: '复杂韵母',
    desc: '专练 ing/ang/ong/iang 等',
    icon: '📚',
    texts: practiceTexts.complexFinals,
  },
  {
    id: 'zeroInitial',
    name: '零声母',
    desc: '专练 an/ai/ao 等无声母字',
    icon: '🎯',
    texts: practiceTexts.zeroInitial,
  },
]

const difficulties = [
  { id: 'beginner', name: '入门', desc: '常用500字', icon: '🌱' },
  { id: 'intermediate', name: '进阶', desc: '常用2000字', icon: '🌿' },
  { id: 'advanced', name: '高级', desc: '包含生僻字', icon: '🌳' },
]

export default function PracticeMode({ onSelect, onClose, darkMode }: PracticeModeProps) {
  const theme = useTheme()

  const handleSelect = (texts: string[]) => {
    const text = texts[Math.floor(Math.random() * texts.length)]
    onSelect(text)
    onClose()
  }

  return (
    <div className={`fixed inset-0 ${theme.modalOverlay} flex items-center justify-center z-50 p-4`}>
      <div className={`${theme.modalCard} max-w-2xl w-full max-h-[90vh] overflow-auto`}>
        <div className={`p-6 border-b ${theme.border} flex justify-between items-center`}>
          <h2 className={`text-2xl font-bold ${theme.text}`}>专项练习</h2>
          <button onClick={onClose} className={`${theme.textMuted} hover:text-white text-2xl leading-none`}>×</button>
        </div>

        <div className="p-6">
          {/* 专项练习 */}
          <h3 className={`font-bold mb-3 ${theme.text}`}>按类型练习</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            {modes.map(mode => (
              <button
                key={mode.id}
                onClick={() => handleSelect(mode.texts)}
                className={`${theme.card} ${theme.cardHover} border ${theme.border} rounded-xl p-4 text-left transition`}
              >
                <div className="text-2xl mb-2">{mode.icon}</div>
                <div className={`font-bold ${theme.text}`}>{mode.name}</div>
                <div className={`text-sm ${theme.textMuted}`}>{mode.desc}</div>
              </button>
            ))}
          </div>

          {/* 难度分级 */}
          <h3 className={`font-bold mb-3 ${theme.text}`}>按难度练习</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {difficulties.map(diff => (
              <button
                key={diff.id}
                onClick={() => {
                  // 根据难度生成文本
                  const texts = practiceTexts.zhChSh.concat(practiceTexts.complexFinals)
                  handleSelect(texts)
                }}
                className={`${theme.card} ${theme.cardHover} border ${theme.border} rounded-xl p-4 text-left transition`}
              >
                <div className="text-2xl mb-2">{diff.icon}</div>
                <div className={`font-bold ${theme.text}`}>{diff.name}</div>
                <div className={`text-sm ${theme.textMuted}`}>{diff.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
