'use client'

import { useEffect, useState } from 'react'

// 键位标注 + 示例词
const keyLabels: Record<string, { initial?: string; final?: string; example?: string }> = {
  q: { initial: 'q', final: 'iu', example: '秋 qiū' },
  w: { initial: 'w', final: 'ei', example: '为 wéi' },
  e: { initial: '', final: 'e', example: '鹅 é' },
  r: { initial: 'r', final: 'uan', example: '软 ruǎn' },
  t: { initial: 't', final: 've', example: '略 lüè' },
  y: { initial: 'y', final: 'un', example: '云 yún' },
  u: { initial: 'sh', final: 'u', example: '书 shū' },
  i: { initial: 'ch', final: 'i', example: '吃 chī' },
  o: { initial: '', final: 'uo', example: '我 wǒ' },
  p: { initial: 'p', final: 'ie', example: '别 bié' },
  a: { initial: '', final: 'a', example: '啊 ā' },
  s: { initial: 's', final: 'ong', example: '松 sōng' },
  d: { initial: 'd', final: 'ai', example: '带 dài' },
  f: { initial: 'f', final: 'en', example: '分 fēn' },
  g: { initial: 'g', final: 'eng', example: '更 gèng' },
  h: { initial: 'h', final: 'ang', example: '航 háng' },
  j: { initial: 'j', final: 'an', example: '见 jiàn' },
  k: { initial: 'k', final: 'ing', example: 'King→ing' },
  l: { initial: 'l', final: 'iang', example: '亮 liàng' },
  z: { initial: 'z', final: 'ou', example: '走 zǒu' },
  x: { initial: 'x', final: 'ia', example: '下 xià' },
  c: { initial: 'c', final: 'ao', example: '草 cǎo' },
  v: { initial: 'zh', final: 'ui', example: '追 zhuī' },
  b: { initial: 'b', final: 'in', example: '宾 bīn' },
  n: { initial: 'n', final: 'iao', example: '鸟 niǎo' },
  m: { initial: 'm', final: 'ian', example: '面 miàn' },
}

const rows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

interface KeyboardProps {
  activeKey: string | null
  targetKeys: [string, string] | null
  currentStep: 0 | 1
  darkMode?: boolean
  onKeyClick?: (key: string) => void
  showWrongKey?: string | null // 显示错误按键
  correctKey?: string | null   // 正确的键
}

export default function Keyboard({ 
  activeKey, targetKeys, currentStep, darkMode = true, onKeyClick, showWrongKey, correctKey 
}: KeyboardProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  useEffect(() => {
    if (activeKey) {
      setPressedKey(activeKey)
      const timer = setTimeout(() => setPressedKey(null), 100)
      return () => clearTimeout(timer)
    }
  }, [activeKey])

  const theme = darkMode ? {
    card: 'bg-gray-800',
    key: 'bg-gray-700 border-gray-900 text-gray-300',
    keyHover: 'hover:bg-gray-600 active:bg-gray-500',
    initial: 'text-blue-400',
    final: 'text-green-400',
    legend: 'text-gray-400',
    tooltip: 'bg-gray-900 text-white',
  } : {
    card: 'bg-white shadow-lg',
    key: 'bg-gray-100 border-gray-300 text-gray-700',
    keyHover: 'hover:bg-gray-200 active:bg-gray-300',
    initial: 'text-blue-600',
    final: 'text-green-600',
    legend: 'text-gray-500',
    tooltip: 'bg-gray-800 text-white',
  }

  const getKeyClass = (key: string) => {
    const base = 'relative w-8 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg md:rounded-xl font-mono flex flex-col items-center justify-center transition-all duration-75 border-b-2 md:border-b-4 select-none cursor-pointer'
    
    // 错误的键 - 红色闪烁
    if (showWrongKey === key) {
      return `${base} bg-red-500 border-red-700 text-white animate-pulse`
    }
    
    // 正确的键 - 绿色闪烁提示
    if (correctKey === key && showWrongKey) {
      return `${base} bg-green-500 border-green-700 text-white animate-pulse`
    }
    
    if (pressedKey === key) {
      return `${base} bg-blue-500 border-blue-700 text-white transform translate-y-0.5 border-b-1 md:border-b-2`
    }
    
    if (targetKeys) {
      if (currentStep === 0 && key === targetKeys[0]) {
        return `${base} bg-yellow-400 border-yellow-500 text-gray-900 animate-pulse`
      }
      if (currentStep === 1 && key === targetKeys[1]) {
        return `${base} bg-green-400 border-green-500 text-gray-900 animate-pulse`
      }
    }
    
    return `${base} ${theme.key} ${theme.keyHover}`
  }

  const handleKeyClick = (key: string) => {
    if (onKeyClick) {
      setPressedKey(key)
      setTimeout(() => setPressedKey(null), 100)
      onKeyClick(key)
    }
  }

  return (
    <div className={`${theme.card} rounded-xl p-2 sm:p-4 md:p-5`}>
      <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
        {rows.map((row, rowIdx) => (
          <div 
            key={rowIdx} 
            className="flex gap-1 sm:gap-1.5 md:gap-2"
            style={{ 
              marginLeft: rowIdx === 1 
                ? 'calc(4px + 0.5vw)' 
                : rowIdx === 2 
                ? 'calc(8px + 1vw)' 
                : '0' 
            }}
          >
            {row.map(key => {
              const label = keyLabels[key]
              return (
                <div 
                  key={key} 
                  className={getKeyClass(key)}
                  onClick={() => handleKeyClick(key)}
                  onTouchStart={(e) => { e.preventDefault(); handleKeyClick(key) }}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                >
                  <span className="text-sm sm:text-base md:text-lg font-bold uppercase">{key}</span>
                  {label && (
                    <div className="hidden sm:flex text-[8px] md:text-[10px] leading-tight mt-0.5 gap-1">
                      {label.initial && <span className={`${theme.initial} px-0.5 rounded`}>{label.initial}</span>}
                      {label.final && <span className={`${theme.final} px-0.5 rounded`}>{label.final}</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      
      {/* 悬停提示 */}
      {hoveredKey && keyLabels[hoveredKey] && (
        <div className={`text-center mt-3 py-2 px-4 rounded-lg ${theme.tooltip} text-sm`}>
          <span className="font-bold uppercase mr-2">{hoveredKey}</span>
          <span className={theme.initial}>{keyLabels[hoveredKey].initial || '—'}</span>
          <span className="mx-1">/</span>
          <span className={theme.final}>{keyLabels[hoveredKey].final}</span>
          {keyLabels[hoveredKey].example && (
            <span className="ml-3 opacity-70">例: {keyLabels[hoveredKey].example}</span>
          )}
        </div>
      )}
      
      {/* 图例 */}
      {!hoveredKey && (
        <div className={`flex justify-center gap-3 sm:gap-4 md:gap-6 mt-2 sm:mt-3 text-xs sm:text-sm ${theme.legend}`}>
          <span><span className={`${theme.initial} font-bold`}>■</span> 声母</span>
          <span><span className={`${theme.final} font-bold`}>■</span> 韵母</span>
          <span><span className="text-yellow-400 font-bold">■</span> 下一键</span>
        </div>
      )}
    </div>
  )
}
