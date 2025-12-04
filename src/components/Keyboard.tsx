'use client'

import { useEffect, useState } from 'react'

const keyLabels: Record<string, { initial?: string; final?: string }> = {
  q: { initial: 'q', final: 'iu' },
  w: { initial: 'w', final: 'ei' },
  e: { initial: '', final: 'e' },
  r: { initial: 'r', final: 'uan' },
  t: { initial: 't', final: 've' },
  y: { initial: 'y', final: 'un' },
  u: { initial: 'sh', final: 'u' },
  i: { initial: 'ch', final: 'i' },
  o: { initial: '', final: 'uo' },
  p: { initial: 'p', final: 'ie' },
  a: { initial: '', final: 'a' },
  s: { initial: 's', final: 'ong' },
  d: { initial: 'd', final: 'ai' },
  f: { initial: 'f', final: 'en' },
  g: { initial: 'g', final: 'eng' },
  h: { initial: 'h', final: 'ang' },
  j: { initial: 'j', final: 'an' },
  k: { initial: 'k', final: 'ing' },
  l: { initial: 'l', final: 'iang' },
  z: { initial: 'z', final: 'ou' },
  x: { initial: 'x', final: 'ia' },
  c: { initial: 'c', final: 'ao' },
  v: { initial: 'zh', final: 'ui' },
  b: { initial: 'b', final: 'in' },
  n: { initial: 'n', final: 'iao' },
  m: { initial: 'm', final: 'ian' },
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
}

export default function Keyboard({ activeKey, targetKeys, currentStep, darkMode = true, onKeyClick }: KeyboardProps) {
  const [pressedKey, setPressedKey] = useState<string | null>(null)

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
  } : {
    card: 'bg-white shadow-lg',
    key: 'bg-gray-100 border-gray-300 text-gray-700',
    keyHover: 'hover:bg-gray-200 active:bg-gray-300',
    initial: 'text-blue-600',
    final: 'text-green-600',
    legend: 'text-gray-500',
  }

  const getKeyClass = (key: string) => {
    // 响应式尺寸：手机小一点，桌面大一点
    const base = 'relative w-8 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg md:rounded-xl font-mono flex flex-col items-center justify-center transition-all duration-75 border-b-2 md:border-b-4 select-none cursor-pointer'
    
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
    <div className={`${theme.card} rounded-xl p-2 sm:p-4 md:p-6`}>
      <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2">
        {rows.map((row, rowIdx) => (
          <div 
            key={rowIdx} 
            className="flex gap-1 sm:gap-1.5 md:gap-2"
            style={{ 
              marginLeft: rowIdx === 1 
                ? 'calc(4px + 1vw)' 
                : rowIdx === 2 
                ? 'calc(8px + 2vw)' 
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
                  onTouchStart={(e) => {
                    e.preventDefault()
                    handleKeyClick(key)
                  }}
                >
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold uppercase">{key}</span>
                  {label && (
                    <div className="hidden sm:block text-[8px] md:text-[10px] lg:text-xs leading-tight mt-0.5">
                      {label.initial && <span className={theme.initial}>{label.initial} </span>}
                      {label.final && <span className={theme.final}>{label.final}</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      
      <div className={`flex justify-center gap-3 sm:gap-4 md:gap-6 mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm ${theme.legend}`}>
        <span><span className={theme.initial}>■</span> 声母</span>
        <span><span className={theme.final}>■</span> 韵母</span>
        <span><span className="text-yellow-400">■</span> 下一键</span>
      </div>
    </div>
  )
}
