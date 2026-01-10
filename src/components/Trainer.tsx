'use client'

import { useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { parsePinyinParts, pinyinToShuangpin } from '@/lib/xiaohe'
import { convertTextToQueue, getRandomText } from '@/lib/converter'
import { playKeySound, playSuccessSound, playErrorSound, getSoundPacks, activateAudio } from '@/lib/sound'
import { saveErrorRecord, updatePracticeStats, saveDailyRecord, checkAndUnlockAchievements } from '@/lib/learning'
import { useTheme } from '@/hooks/useTheme'
import { useTrainerSettings } from '@/hooks/useTrainerSettings'
import { useTrainerState } from '@/hooks/useTrainerState'
import { useTrainerDerived } from '@/hooks/useTrainerDerived'
import Keyboard from './Keyboard'
const Tutorial = dynamic(() => import('./Tutorial'), { ssr: false })
const PracticeMode = dynamic(() => import('./PracticeMode'), { ssr: false })
const Stats = dynamic(() => import('./Stats'), { ssr: false })
const ShuangpinLookup = dynamic(() => import('./ShuangpinLookup'), { ssr: false })
const CustomTextModal = dynamic(() => import('./CustomTextModal'), { ssr: false })

export default function Trainer() {
  const {
    state,
    setInputText,
    setQueue,
    setCurrentIndex,
    setInputBuffer,
    setIsError,
    setIsStarted,
    setStats,
    setLastPressedKey,
    incrementKeyPressId,
    setAutoNext,
    setIsLoading,
    setShowTutorial,
    setShowPracticeMode,
    setShowStats,
    setShowLookup,
    setShowCustomText,
    setFollowMode,
    setTimeLeft,
    setIsTimedMode,
    setTimedDuration,
    setWrongKey,
    setCorrectKey,
    setIsEditingPinyin,
    setPinyinDraft,
    setPinyinEditError,
    setNewAchievements,
  } = useTrainerState()
  const {
    inputText,
    queue,
    currentIndex,
    inputBuffer,
    isError,
    isStarted,
    stats,
    lastPressedKey,
    keyPressId,
    autoNext,
    isLoading,
    showTutorial,
    showPracticeMode,
    showStats,
    showLookup,
    showCustomText,
    followMode,
    timeLeft,
    isTimedMode,
    timedDuration,
    wrongKey,
    correctKey,
    isEditingPinyin,
    pinyinDraft,
    pinyinEditError,
    newAchievements,
  } = state
  const {
    darkMode,
    setDarkMode,
    soundEnabled,
    setSoundEnabled,
    soundPackId,
    setSoundPackId,
    keyVolume,
    setKeyVolume,
    successVolume,
    setSuccessVolume,
    errorVolume,
    setErrorVolume,
    learningMode,
    setLearningMode,
    textSource,
    setTextSource,
    allowShortFullPinyin,
    setAllowShortFullPinyin,
  } = useTrainerSettings()
  const startTimeRef = useRef<number>(0)

  const safeDecode = useCallback((value: string) => {
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }, [])

  const decodeSharedText = useCallback((value: string) => {
    const once = safeDecode(value)
    if (/%[0-9A-Fa-f]{2}/.test(once)) {
      const twice = safeDecode(once)
      return twice
    }
    return once
  }, [safeDecode])

  // 从 URL 参数恢复设置
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlText = params.get('text')
    const urlMode = params.get('mode')
    const urlTimed = params.get('timed')
    
    // URL 参数优先
    if (urlText) {
      const decodedText = decodeSharedText(urlText)
      setInputText(decodedText)
      setTimeout(() => startPractice(decodedText), 100)
    }
    if (urlMode === 'blind') setLearningMode('blind')
    if (urlTimed) {
      setIsTimedMode(true)
      setTimedDuration(parseInt(urlTimed) || 60)
      setTimeLeft(parseInt(urlTimed) || 60)
    }
    
    const visited = localStorage.getItem('shuangpin_visited')
    if (!visited) {
      setShowTutorial(true)
      localStorage.setItem('shuangpin_visited', 'true')
    }
  }, [decodeSharedText])

  useEffect(() => {
    if (!soundEnabled) return
    const handleFirstInteraction = () => {
      activateAudio()
    }
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true })
    window.addEventListener('keydown', handleFirstInteraction, { once: true })
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [soundEnabled])
  
  // 生成分享链接
  const getShareUrl = () => {
    const params = new URLSearchParams()
    if (inputText) params.set('text', inputText)
    if (learningMode === 'blind') params.set('mode', 'blind')
    if (isTimedMode) params.set('timed', String(timedDuration))
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }

  const normalizePinyinInput = useCallback((raw: string) => {
    return raw.trim().toLowerCase().replace('u:', 'v').replace('ü', 'v')
  }, [])

  const applyPinyinEdit = useCallback((index: number, raw: string) => {
    const normalized = normalizePinyinInput(raw)
    if (!normalized || !/^[a-z]+$/.test(normalized)) {
      setPinyinEditError('请输入正确的拼音（仅字母）')
      return
    }
    const { initial, final } = parsePinyinParts(normalized)
    const shuangpin = pinyinToShuangpin(normalized, initial, final)
    if (shuangpin.length !== 2) {
      setPinyinEditError('未识别的拼音，无法生成双拼')
      return
    }
    setQueue(q => q.map((item, i) => (
      i === index
        ? {
            ...item,
            pinyin: normalized,
            initial,
            final,
            shuangpin,
            pinyinSource: item.autoPinyin === normalized ? 'auto' : 'manual',
          }
        : item
    )))
    setIsEditingPinyin(false)
    setPinyinDraft('')
    setPinyinEditError('')
    setInputBuffer('')
    setIsError(false)
    setWrongKey(null)
    setCorrectKey(null)
  }, [normalizePinyinInput])

  const resetPinyinEdit = useCallback((index: number) => {
    setQueue(q => q.map((item, i) => {
      if (i !== index || !item.autoPinyin) return item
      const normalized = normalizePinyinInput(item.autoPinyin)
      const { initial, final } = parsePinyinParts(normalized)
      return {
        ...item,
        pinyin: normalized,
        initial,
        final,
        shuangpin: pinyinToShuangpin(normalized, initial, final),
        pinyinSource: 'auto',
      }
    }))
    setIsEditingPinyin(false)
    setPinyinDraft('')
    setPinyinEditError('')
    setInputBuffer('')
    setIsError(false)
    setWrongKey(null)
    setCorrectKey(null)
  }, [normalizePinyinInput])

  const openPinyinEditor = useCallback((currentPinyin: string) => {
    setIsEditingPinyin(true)
    setPinyinDraft(currentPinyin)
    setPinyinEditError('')
  }, [])

  const startPractice = useCallback((text: string, isFollow = false) => {
    const q = convertTextToQueue(text)
    if (q.length === 0) return
    setQueue(q)
    setCurrentIndex(0)
    setInputBuffer('')
    setIsError(false)
    setWrongKey(null)
    setCorrectKey(null)
    setIsEditingPinyin(false)
    setPinyinDraft('')
    setPinyinEditError('')
    setIsStarted(true)
    setStats({ correct: 0, errors: 0 })
    startTimeRef.current = Date.now()
    setFollowMode(isFollow)
    if (isTimedMode) setTimeLeft(timedDuration)
  }, [isTimedMode, timedDuration])

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
    const target = current.shuangpin.toLowerCase()
    const fullPinyin = current.pinyin.toLowerCase()
    const allowFullPinyin = allowShortFullPinyin && fullPinyin.length <= 2
    const allowedSequences = allowFullPinyin ? [target, fullPinyin] : [target]
    const nextBuffer = `${inputBuffer}${key}`.toLowerCase()
    const matches = allowedSequences.filter(seq => seq.startsWith(nextBuffer))

    setLastPressedKey(key)
    incrementKeyPressId()

    if (matches.length === 0) {
      const expectedIndex = Math.min(inputBuffer.length, target.length - 1)
      if (soundEnabled) playErrorSound()
      setIsError(true)
      setWrongKey(key)
      setCorrectKey(target[expectedIndex])
      setStats(s => ({ ...s, errors: s.errors + 1 }))
      saveErrorRecord(current.char, current.pinyin, current.shuangpin, true)
      setInputBuffer('')
      setTimeout(() => {
        setIsError(false)
        setWrongKey(null)
        setCorrectKey(null)
      }, 500)
      return
    }

    const isComplete = matches.some(seq => seq.length === nextBuffer.length)
    if (isComplete) {
      if (soundEnabled) {
        playSuccessSound()
      }
      setStats(s => ({ ...s, correct: s.correct + 1 }))
      saveErrorRecord(current.char, current.pinyin, current.shuangpin, false)
      setCurrentIndex(i => i + 1)
      setInputBuffer('')
      setIsError(false)
      setWrongKey(null)
      setCorrectKey(null)
      return
    }

    if (soundEnabled) playKeySound()
    setInputBuffer(nextBuffer)
    setIsError(false)
    setWrongKey(null)
    setCorrectKey(null)
  }, [isStarted, currentIndex, queue, inputBuffer, soundEnabled, isTimedMode, timeLeft, allowShortFullPinyin])

  // 跳过当前字
  const skipCurrentChar = useCallback(() => {
    if (!isStarted || currentIndex >= queue.length) return
    setStats(s => ({ ...s, errors: s.errors + 1 }))
    setCurrentIndex(i => i + 1)
    setInputBuffer('')
    setIsError(false)
    setWrongKey(null)
    setCorrectKey(null)
  }, [isStarted, currentIndex, queue.length])

  // 物理键盘事件（包含快捷键）
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
      return
    }

    // 快捷键
    if (e.key === 'Escape') {
      e.preventDefault()
      setIsStarted(false)
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      skipCurrentChar()
      return
    }
    if (e.key === ' ') {
      e.preventDefault()
      randomText()
      return
    }

    if (e.key === 'Backspace') {
      if (!isStarted || inputBuffer.length === 0) return
      e.preventDefault()
      setInputBuffer(buffer => buffer.slice(0, -1))
      setIsError(false)
      setWrongKey(null)
      setCorrectKey(null)
      return
    }
    
    // 字母输入
    const key = e.key.toLowerCase()
    if (!/^[a-z]$/.test(key)) return
    e.preventDefault()
    handleKeyInput(key)
  }, [handleKeyInput, inputBuffer.length, isStarted, skipCurrentChar])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const { current, isComplete, showHintKeys, targetKeys } = useTrainerDerived(state, learningMode)

  // 完成时保存统计和检查成就
  useEffect(() => {
    if (isComplete && stats.correct > 0) {
      const time = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const accuracy = (stats.correct / (stats.correct + stats.errors)) * 100
      const speed = time > 0 ? Math.round(stats.correct / (time / 60)) : 0
      
      updatePracticeStats(stats.correct, stats.errors, time)
      saveDailyRecord(stats.correct, stats.errors, time)
      
      // 检查成就
      const unlocked = checkAndUnlockAchievements(accuracy, speed)
      if (unlocked.length > 0) {
        setNewAchievements(unlocked)
        setTimeout(() => setNewAchievements([]), 5000)
      }
    }
  }, [isComplete])

  // 自动下一个
  useEffect(() => {
    if (isComplete && autoNext && !isTimedMode) {
      const timer = setTimeout(() => randomText(), 1500)
      return () => clearTimeout(timer)
    }
  }, [isComplete, autoNext, textSource, isTimedMode])
  
  useEffect(() => {
    setIsEditingPinyin(false)
    setPinyinDraft('')
    setPinyinEditError('')
  }, [currentIndex])

  const theme = useTheme(darkMode)

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
            <button onClick={() => setShowTutorial(true)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`} title="教程" aria-label="打开教程">
              📖
            </button>
            <button onClick={() => setShowStats(true)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`} title="统计" aria-label="查看统计">
              📊
            </button>
            <button onClick={() => setShowLookup(true)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`} title="双拼查询" aria-label="双拼查询">
              🔍
            </button>
            <button onClick={() => setAutoNext(!autoNext)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${autoNext ? 'bg-purple-600 text-white' : theme.btn}`} title="自动下一个" aria-label={autoNext ? '关闭自动下一个' : '开启自动下一个'}>
              {autoNext ? '🔄' : '⏸️'}
            </button>
            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`} aria-label={soundEnabled ? '关闭声音' : '开启声音'}>
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button onClick={() => setDarkMode(!darkMode)} className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition text-sm sm:text-base ${theme.btn}`} aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}>
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
          targetKeys={targetKeys}
          currentStep={inputBuffer.length === 0 ? 0 : 1}
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
                <div className={`text-sm sm:text-base ${theme.textMuted} flex items-center gap-2`}>
                  <span>拼音:</span>
                  <span className={theme.text}>{current.pinyin}</span>
                  <button
                    onClick={() => openPinyinEditor(current.pinyin)}
                    className="text-xs px-2 py-0.5 rounded bg-gray-700/60 text-gray-200 hover:bg-gray-600"
                    title="修改拼音（多音字校正）"
                  >
                    ✏️
                  </button>
                  {current.pinyinSource === 'manual' && (
                    <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-yellow-700/60 text-yellow-200">
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
                        if (e.key === 'Enter') applyPinyinEdit(currentIndex, pinyinDraft)
                      }}
                      className={`px-2 py-1 rounded border ${theme.input} ${theme.text} w-32`}
                      placeholder="输入拼音"
                    />
                    <button
                      onClick={() => applyPinyinEdit(currentIndex, pinyinDraft)}
                      className="px-2 py-1 rounded bg-blue-600 text-white"
                    >
                      应用
                    </button>
                    {current.autoPinyin && current.pinyinSource === 'manual' && (
                      <button
                        onClick={() => resetPinyinEdit(currentIndex)}
                        className="px-2 py-1 rounded bg-gray-600 text-white"
                      >
                        重置
                      </button>
                    )}
                    <button
                      onClick={() => { setIsEditingPinyin(false); setPinyinEditError('') }}
                      className="px-2 py-1 rounded bg-gray-600 text-white"
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
                    你按了 <span className="font-mono bg-red-900/50 px-1 rounded">{wrongKey}</span>，
                    正确是 <span className="font-mono bg-green-900/50 px-1 rounded">{correctKey}</span>
                    <span className="ml-2 text-[10px] sm:text-xs text-yellow-300">目标 {current.shuangpin}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 完成提示 */}
        {isComplete && (
          <div className={`${theme.card} rounded-xl p-4 sm:p-6 mt-4`}>
            <div className="text-3xl sm:text-4xl mb-4 text-center">
              {isTimedMode && timeLeft <= 0 ? '⏰ 时间到！' : '🎉 完成！'}
            </div>
            
            {/* 详细统计卡片 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                <div className="text-2xl font-bold text-blue-500">{stats.correct}</div>
                <div className={`text-xs ${theme.textMuted}`}>正确字数</div>
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
                <div className={`text-xs ${theme.textMuted}`}>错误次数</div>
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                <div className="text-2xl font-bold text-green-500">
                  {stats.correct + stats.errors > 0 ? ((stats.correct / (stats.correct + stats.errors)) * 100).toFixed(1) : 0}%
                </div>
                <div className={`text-xs ${theme.textMuted}`}>准确率</div>
              </div>
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg p-3 text-center`}>
                <div className="text-2xl font-bold text-purple-500">{getSpeed()}</div>
                <div className={`text-xs ${theme.textMuted}`}>字/分钟</div>
              </div>
            </div>

            {/* 学习建议 */}
            {stats.errors > stats.correct * 0.3 && (
              <div className={`${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100'} rounded-lg p-3 mb-4 text-sm`}>
                💡 <span className={theme.textMuted}>建议：错误率较高，可以试试</span>
                <button onClick={() => setShowPracticeMode(true)} className="text-blue-500 ml-1 underline">专项练习</button>
                <span className={theme.textMuted}>，针对薄弱环节强化</span>
              </div>
            )}
            
            {autoNext && !isTimedMode && (
              <p className="text-purple-400 text-center text-sm mb-3">1.5秒后自动加载下一段...</p>
            )}
            
            {/* 操作按钮 */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  const url = getShareUrl()
                  navigator.clipboard.writeText(url)
                  alert('链接已复制！分享给朋友一起练习吧')
                }}
                className={`px-4 py-1.5 text-sm rounded-lg ${theme.btn}`}
              >
                🔗 分享
              </button>
              <button
                onClick={() => setShowStats(true)}
                className={`px-4 py-1.5 text-sm rounded-lg ${theme.btn}`}
              >
                📊 查看统计
              </button>
            </div>
          </div>
        )}

        {/* 成就解锁提示 */}
        {newAchievements.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2">
            {newAchievements.map((a) => (
              <div
                key={a.id}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-3 rounded-xl shadow-lg animate-bounce"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{a.icon}</span>
                  <div>
                    <div className="font-bold">🎉 成就解锁！</div>
                    <div className="text-sm">{a.name} - {a.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 文字进度条 / 跟打模式原文 */}
        {isStarted && (
          <div className={`${theme.card} rounded-xl p-4 mt-4`}>
            {followMode && !isComplete && (
              <div className={`mb-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className={`text-xs ${theme.textMuted} mb-1`}>📖 原文（照着打）</div>
                <div className={`text-lg leading-relaxed ${theme.text}`}>
                  {inputText}
                </div>
              </div>
            )}
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
              {followMode && <span className="ml-2 text-green-500">📖 跟打模式</span>}
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
            aria-label="练习文本输入"
          />
          <div className="flex flex-wrap gap-3 mt-3">
            <button onClick={() => startPractice(inputText)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              开始练习
            </button>
            <button onClick={randomText} disabled={isLoading} className={`px-5 py-2 rounded-lg transition ${theme.btn} ${isLoading ? 'opacity-50' : ''}`}>
              {isLoading ? '⏳ 加载中...' : '🎲 随机文本'}
            </button>
            <button onClick={() => setShowCustomText(true)} className={`px-5 py-2 rounded-lg transition ${theme.btn}`}>
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
            <span><kbd className="px-1.5 py-0.5 bg-gray-600 rounded text-gray-300">Space</kbd> 随机文本</span>
            <span><kbd className="px-1.5 py-0.5 bg-gray-600 rounded text-gray-300">Tab</kbd> 跳过当前字</span>
            <span><kbd className="px-1.5 py-0.5 bg-gray-600 rounded text-gray-300">Esc</kbd> 结束练习</span>
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
      {showLookup && (
        <ShuangpinLookup onClose={() => setShowLookup(false)} darkMode={darkMode} />
      )}
      {showCustomText && (
        <CustomTextModal
          onStart={(text, mode) => {
            setInputText(text)
            startPractice(text, mode === 'follow')
          }}
          onClose={() => setShowCustomText(false)}
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
