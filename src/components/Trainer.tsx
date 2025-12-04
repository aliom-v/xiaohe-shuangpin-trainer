'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { CharInfo } from '@/lib/xiaohe'
import { convertTextToQueue, getRandomText } from '@/lib/converter'
import { playKeySound, playSuccessSound, playErrorSound, playCompleteSound } from '@/lib/sound'
import { saveErrorRecord, updatePracticeStats } from '@/lib/learning'
import Keyboard from './Keyboard'
import Tutorial from './Tutorial'
import PracticeMode from './PracticeMode'
import Stats from './Stats'

type InputState = 'WAITING' | 'HALF_MATCH'
type LearningMode = 'normal' | 'hint' | 'blind' | 'timed'

export default function Trainer() {
  const [inputText, setInputText] = useState('')
  const [queue, setQueue] = useState<CharInfo[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputState, setInputState] = useState<InputState>('WAITING')
  const [inputBuffer, setInputBuffer] = useState('')
  const [isError, setIsError] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [stats, setStats] = useState({ correct: 0, errors: 0 })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null)
  const [keyPressId, setKeyPressId] = useState(0)
  const [autoNext, setAutoNext] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [textSource, setTextSource] = useState<'local' | 'online'>('local')
  
  // 学习功能状态
  const [showTutorial, setShowTutorial] = useState(false)
  const [showPracticeMode, setShowPracticeMode] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [learningMode, setLearningMode] = useState<LearningMode>('hint')
  const [timeLeft, setTimeLeft] = useState(60)
  const [isTimedMode, setIsTimedMode] = useState(false)
  const [timedDuration, setTimedDuration] = useState(60)
  const startTimeRef = useRef<number>(0)
  const [wrongKey, setWrongKey] = useState<string | null>(null)
  const [correctKey, setCorrectKey] = useState<string | null>(null)

  // 从 localStorage 恢复设置
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('shuangpin_darkMode')
    const savedSound = localStorage.getItem('shuangpin_sound')
    const savedMode = localStorage.getItem('shuangpin_mode')
    const savedSource = localStorage.getItem('shuangpin_source')
    
    if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true')
    if (savedSound !== null) setSoundEnabled(savedSound === 'true')
    if (savedMode) setLearningMode(savedMode as LearningMode)
    if (savedSource) setTextSource(savedSource as 'local' | 'online')
    
    const visited = localStorage.getItem('shuangpin_visited')
    if (!visited) {
      setShowTutorial(true)
      localStorage.setItem('shuangpin_visited', 'true')
    }
  }, [])

  // 保存设置到 localStorage
  useEffect(() => {
    localStorage.setItem('shuangpin_darkMode', String(darkMode))
  }, [darkMode])
  
  useEffect(() => {
    localStorage.setItem('shuangpin_sound', String(soundEnabled))
  }, [soundEnabled])
  
  useEffect(() => {
    localStorage.setItem('shuangpin_mode', learningMode)
  }, [learningMode])
  
  useEffect(() => {
    localStorage.setItem('shuangpin_source', textSource)
  }, [textSource])

  const startPractice = useCallback((text: string) => {
    const q = convertTextToQueue(text)
    if (q.length === 0) return
    setQueue(q)
    setCurrentIndex(0)
    setInputState('WAITING')
    setInputBuffer('')
    setIsError(false)
    setIsStarted(true)
    setStats({ correct: 0, errors: 0 })
    startTimeRef.current = Date.now()
    if (isTimedMode) setTimeLeft(60)
  }, [isTimedMode])

  const randomLocalText = () => {
    const text = getRandomText()
    setInputText(text)
    startPractice(text)
  }

  const fetchOnlineText = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/random-text')
      const data = await res.json()
      if (data.success && data.text) {
        setInputText(data.text)
        startPractice(data.text)
      } else {
        randomLocalText()
      }
    } catch {
      randomLocalText()
    } finally {
      setIsLoading(false)
    }
  }

  const randomText = () => {
    if (textSource === 'online') {
      fetchOnlineText()
    } else {
      randomLocalText()
    }
  }

  // 限时模式计时器
  useEffect(() => {
    if (isTimedMode && isStarted && !isComplete && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isTimedMode, isStarted, timeLeft])

  // 处理按键输入（物理键盘和虚拟键盘共用）
  const handleKeyInput = useCallback((key: string) => {
    if (!isStarted || currentIndex >= queue.length) return
    if (isTimedMode && timeLeft <= 0) return
    
    const current = queue[currentIndex]
    const target = current.shuangpin

    setLastPressedKey(key)
    setKeyPressId(id => id + 1)

    if (inputState === 'WAITING') {
      if (key === target[0]) {
        if (soundEnabled) playKeySound()
        setInputBuffer(key)
        setInputState('HALF_MATCH')
        setIsError(false)
        setWrongKey(null)
        setCorrectKey(null)
      } else {
        if (soundEnabled) playErrorSound()
        setIsError(true)
        setWrongKey(key)
        setCorrectKey(target[0])
        setStats(s => ({ ...s, errors: s.errors + 1 }))
        saveErrorRecord(current.char, current.pinyin, current.shuangpin, true)
        setTimeout(() => { setIsError(false); setWrongKey(null); setCorrectKey(null) }, 500)
      }
    } else if (inputState === 'HALF_MATCH') {
      if (key === target[1]) {
        const isLastChar = currentIndex === queue.length - 1
        if (soundEnabled) {
          isLastChar ? playCompleteSound() : playSuccessSound()
        }
        setStats(s => ({ ...s, correct: s.correct + 1 }))
        saveErrorRecord(current.char, current.pinyin, current.shuangpin, false)
        setCurrentIndex(i => i + 1)
        setInputBuffer('')
        setInputState('WAITING')
        setIsError(false)
        setWrongKey(null)
        setCorrectKey(null)
      } else {
        if (soundEnabled) playErrorSound()
        setIsError(true)
        setWrongKey(key)
        setCorrectKey(target[1])
        setStats(s => ({ ...s, errors: s.errors + 1 }))
        saveErrorRecord(current.char, current.pinyin, current.shuangpin, true)
        setInputBuffer('')
        setInputState('WAITING')
        setTimeout(() => { setIsError(false); setWrongKey(null); setCorrectKey(null) }, 500)
      }
    }
  }, [isStarted, currentIndex, queue, inputState, soundEnabled, isTimedMode, timeLeft])

  // 物理键盘事件
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase()
    if (!/^[a-z]$/.test(key)) return
    e.preventDefault()
    handleKeyInput(key)
  }, [handleKeyInput])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const current = queue[currentIndex]
  const isComplete = isStarted && (currentIndex >= queue.length || (isTimedMode && timeLeft <= 0))

  // 完成时保存统计
  useEffect(() => {
    if (isComplete && stats.correct > 0) {
      const time = Math.floor((Date.now() - startTimeRef.current) / 1000)
      updatePracticeStats(stats.correct, stats.errors, time)
    }
  }, [isComplete])

  // 自动下一个
  useEffect(() => {
    if (isComplete && autoNext && !isTimedMode) {
      const timer = setTimeout(() => randomText(), 1500)
      return () => clearTimeout(timer)
    }
  }, [isComplete, autoNext, textSource, isTimedMode])

  const theme = darkMode ? {
    bg: 'bg-gray-900',
    text: 'text-white',
    textMuted: 'text-gray-400',
    card: 'bg-gray-800',
    input: 'bg-gray-800 border-gray-700',
    btn: 'bg-gray-700 hover:bg-gray-600',
  } : {
    bg: 'bg-gray-100',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    card: 'bg-white shadow-lg',
    input: 'bg-white border-gray-300',
    btn: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  }

  // 计算速度
  const getSpeed = () => {
    if (!isStarted || stats.correct === 0) return 0
    const time = (Date.now() - startTimeRef.current) / 1000 / 60
    return Math.round(stats.correct / time)
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-6 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        {/* 标题栏 */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold">小鹤双拼练习器</h1>
            <p className={`text-xs sm:text-base ${theme.textMuted}`}>Xiaohe Shuangpin Trainer</p>
          </div>
          <div className="flex gap-1 sm:gap-2">
            <button onClick={() => setShowTutorial(true)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`} title="教程">
              📖
            </button>
            <button onClick={() => setShowStats(true)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`} title="统计">
              📊
            </button>
            <button onClick={() => setAutoNext(!autoNext)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${autoNext ? 'bg-purple-600 text-white' : theme.btn}`} title="自动下一个">
              {autoNext ? '🔄' : '⏸️'}
            </button>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`}>
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`}>
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* 学习模式选择 */}
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
            onClick={() => setShowPracticeMode(true)}
            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm transition ${theme.btn}`}
            title="专项练习特定声母/韵母"
          >
            🎯 <span className="hidden sm:inline">专项</span>
          </button>
          {/* 限时进度条 */}
          {isTimedMode && isStarted && !isComplete && (
            <div className="ml-auto flex items-center gap-2">
              <div className={`w-20 sm:w-32 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
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
              {getSpeed()}字/分
            </span>
          )}
        </div>

        {/* 键盘 */}
        <Keyboard
          activeKey={lastPressedKey}
          key={keyPressId}
          targetKeys={current && !isComplete && learningMode === 'hint' ? [current.shuangpin[0], current.shuangpin[1]] : null}
          currentStep={inputState === 'WAITING' ? 0 : 1}
          darkMode={darkMode}
          onKeyClick={handleKeyInput}
          showWrongKey={wrongKey}
          correctKey={correctKey}
        />

        {/* 当前字信息 */}
        {isStarted && current && !isComplete && (
          <div className={`${theme.card} rounded-xl p-6 mt-4 text-center`}>
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              <div className="text-4xl sm:text-6xl">{current.char}</div>
              <div className="text-left">
                <div className={`text-sm sm:text-base ${theme.textMuted}`}>
                  拼音: <span className={theme.text}>{current.pinyin}</span>
                </div>
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
                    你按了 <span className="font-mono bg-red-900/50 px-1 rounded">{wrongKey}</span>，
                    正确是 <span className="font-mono bg-green-900/50 px-1 rounded">{correctKey}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 完成提示 */}
        {isComplete && (
          <div className={`${theme.card} rounded-xl p-4 sm:p-6 mt-4 text-center`}>
            <div className="text-3xl sm:text-4xl mb-4">{isTimedMode && timeLeft <= 0 ? '⏰ 时间到！' : '🎉 完成！'}</div>
            <p className={`text-sm sm:text-base ${theme.textMuted}`}>
              正确: {stats.correct} | 错误: {stats.errors} | 
              准确率: {stats.correct + stats.errors > 0 ? ((stats.correct / (stats.correct + stats.errors)) * 100).toFixed(1) : 0}%
              {isTimedMode && ` | ${stats.correct}字/分`}
            </p>
            {autoNext && !isTimedMode && (
              <p className="text-purple-400 mt-2 text-sm">1.5秒后自动加载下一段...</p>
            )}
          </div>
        )}

        {/* 文字进度条 */}
        {isStarted && (
          <div className={`${theme.card} rounded-xl p-4 mt-4`}>
            <div className="flex flex-wrap gap-1 text-lg justify-center">
              {queue.map((item, idx) => (
                <span
                  key={idx}
                  className={`px-1.5 py-0.5 rounded transition-all ${
                    idx < currentIndex
                      ? 'text-green-500 bg-green-500/10'
                      : idx === currentIndex
                      ? `text-yellow-500 bg-yellow-500/20 ${isError ? 'animate-shake' : ''}`
                      : theme.textMuted
                  }`}
                >
                  {item.char}
                </span>
              ))}
            </div>
            <div className={`text-center mt-3 text-sm ${theme.textMuted}`}>
              进度: {currentIndex}/{queue.length} | 正确: {stats.correct} | 错误: {stats.errors}
            </div>
          </div>
        )}

        {/* 输入区 */}
        <div className={`${theme.card} rounded-xl p-4 mt-4`}>
          <textarea
            className={`w-full p-3 rounded-lg border ${theme.input} focus:border-blue-500 focus:outline-none resize-none ${theme.bg} ${theme.text}`}
            rows={2}
            placeholder="在此粘贴要练习的文本，或点击随机文本..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="flex flex-wrap gap-3 mt-3">
            <button onClick={() => startPractice(inputText)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              开始练习
            </button>
            <button onClick={randomText} disabled={isLoading} className={`px-5 py-2 rounded-lg transition ${theme.btn} ${isLoading ? 'opacity-50' : ''}`}>
              {isLoading ? '⏳ 加载中...' : '🎲 随机文本'}
            </button>
            <button
              onClick={() => setTextSource(textSource === 'local' ? 'online' : 'local')}
              className={`px-5 py-2 rounded-lg transition ${textSource === 'online' ? 'bg-green-600 text-white' : theme.btn}`}
            >
              {textSource === 'online' ? '🌐 在线' : '📦 本地'}
            </button>
          </div>
        </div>
      </div>

      {/* 弹窗 */}
      {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} darkMode={darkMode} />}
      {showPracticeMode && (
        <PracticeMode
          onSelect={(text) => { setInputText(text); startPractice(text) }}
          onClose={() => setShowPracticeMode(false)}
          darkMode={darkMode}
        />
      )}
      {showStats && (
        <Stats
          onClose={() => setShowStats(false)}
          onPracticeErrors={(chars) => { setInputText(chars); startPractice(chars) }}
          darkMode={darkMode}
        />
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.15s ease-in-out; }
      `}</style>
    </div>
  )
}
