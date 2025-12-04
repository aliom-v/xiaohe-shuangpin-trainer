'use client'

import { useState } from 'react'
import { initialMap, finalMap } from '@/lib/xiaohe'

interface TutorialProps {
  onClose: () => void
  darkMode: boolean
}

const steps = [
  {
    title: '什么是双拼？',
    content: '双拼是一种高效的拼音输入法。普通拼音需要打多个字母，而双拼只需要两个键：一个声母键 + 一个韵母键。',
    example: '比如「双」：普通拼音要打 shuang（6键），双拼只需 ul（2键）',
  },
  {
    title: '声母规则',
    content: '大部分声母保持原位不变，只有三个需要变位：',
    example: 'zh → v\nch → i\nsh → u\n\n例如：中(zhong) → vs，吃(chi) → ii，是(shi) → ui',
  },
  {
    title: '韵母规则',
    content: '韵母需要记忆对应的键位。小鹤双拼的设计很有规律：',
    example: 'ai→d  ei→w  ao→c  ou→z\nan→j  en→f  ang→h  eng→g\ning→k  ong→s  iang→l  uang→l',
  },
  {
    title: '零声母规则',
    content: '没有声母的字（如：安、爱、啊）使用特殊规则：韵母首字母 + 韵母键',
    example: '安(an) → aj（a + an的键j）\n爱(ai) → ad（a + ai的键d）\n啊(a) → aa（a + a）',
  },
  {
    title: '学习路线建议',
    content: '推荐按以下顺序循序渐进：',
    example: '第1周：熟悉键位表，用「提示模式」练习\n第2周：专项练习变位声母 zh/ch/sh\n第3周：专项练习复杂韵母 ing/ang/ong\n第4周：切换「盲打模式」，脱离提示\n之后：挑战限时模式，提升速度！',
  },
  {
    title: '开始练习！',
    content: '现在你已经了解了基本规则，开始练习吧！',
    example: '💡 提示模式：键盘高亮下一个键\n🙈 盲打模式：隐藏双拼提示\n⏱️ 限时模式：挑战打字速度\n🎯 专项练习：针对薄弱环节\n\n快捷键：Space随机文本 | Tab跳过 | Esc结束',
  },
]

export default function Tutorial({ onClose, darkMode }: TutorialProps) {
  const [step, setStep] = useState(0)
  const [showTable, setShowTable] = useState(false)

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

  const currentStep = steps[step]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`${theme.card} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto`}>
        {/* 头部 */}
        <div className={`p-6 border-b ${theme.border}`}>
          <div className="flex justify-between items-center">
            <h2 className={`text-2xl font-bold ${theme.text}`}>小鹤双拼教程</h2>
            <button onClick={onClose} className={`${theme.textMuted} hover:${theme.text} text-2xl`}>×</button>
          </div>
          {/* 进度条 */}
          <div className="flex gap-2 mt-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 内容 */}
        <div className="p-6">
          <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>{currentStep.title}</h3>
          <p className={`${theme.textMuted} mb-4 whitespace-pre-line`}>{currentStep.content}</p>
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-4 font-mono text-sm whitespace-pre-line ${theme.text}`}>
            {currentStep.example}
          </div>

          {/* 对照表按钮 */}
          {step >= 2 && (
            <button
              onClick={() => setShowTable(!showTable)}
              className="mt-4 text-blue-500 hover:text-blue-400 text-sm"
            >
              {showTable ? '隐藏完整对照表 ▲' : '查看完整对照表 ▼'}
            </button>
          )}

          {/* 对照表 */}
          {showTable && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {/* 声母表 */}
              <div>
                <h4 className={`font-bold mb-2 ${theme.text}`}>声母表</h4>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 text-xs`}>
                  {Object.entries(initialMap).map(([k, v]) => (
                    <span key={k} className={`inline-block mr-3 ${theme.text}`}>
                      {k}→<span className="text-blue-400">{v}</span>
                    </span>
                  ))}
                </div>
              </div>
              {/* 韵母表 */}
              <div>
                <h4 className={`font-bold mb-2 ${theme.text}`}>韵母表</h4>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 text-xs`}>
                  {Object.entries(finalMap).map(([k, v]) => (
                    <span key={k} className={`inline-block mr-3 ${theme.text}`}>
                      {k}→<span className="text-green-400">{v}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className={`p-6 border-t ${theme.border} flex justify-between`}>
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className={`px-6 py-2 rounded-lg transition ${step === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${theme.text}`}
          >
            上一步
          </button>
          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              下一步
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              开始练习！
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
