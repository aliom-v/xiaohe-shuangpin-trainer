'use client'

import { useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { parsePinyinParts, pinyinToShuangpin } from '@/lib/xiaohe'
import { convertTextToQueue, getRandomText } from '@/lib/converter'
import { playKeySound, playSuccessSound, playErrorSound, activateAudio } from '@/lib/sound'
import { saveErrorRecord, updatePracticeStats, saveDailyRecord, checkAndUnlockAchievements } from '@/lib/learning'
import { useTheme } from '@/hooks/useTheme'
import { useTrainerSettings } from '@/hooks/useTrainerSettings'
import { useTrainerState } from '@/hooks/useTrainerState'
import { useTrainerDerived } from '@/hooks/useTrainerDerived'
import Keyboard from './Keyboard'
import {
  HeaderBar,
  ModeSelector,
  CurrentCharPanel,
  CompletionPanel,
  AchievementToast,
  ProgressPanel,
  InputArea,
} from './trainer/index'

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
    inputText, queue, currentIndex, inputBuffer, isError, isStarted, stats,
    lastPressedKey, keyPressId, autoNext, isLoading, showTutorial, showPracticeMode,
    showStats, showLookup, showCustomText, followMode, timeLeft, isTimedMode,
    timedDuration, wrongKey, correctKey, isEditingPinyin, pinyinDraft,
    pinyinEditError, newAchievements,
  } = state

  const {
    darkMode, setDarkMode, soundEnabled, setSoundEnabled, soundPackId, setSoundPackId,
    keyVolume, setKeyVolume, successVolume, setSuccessVolume, errorVolume, setErrorVolume,
    learningMode, setLearningMode, textSource, setTextSource,
    allowShortFullPinyin, setAllowShortFullPinyin,
  } = useTrainerSettings()

  const startTimeRef = useRef<number>(0)
  const theme = useTheme()
  const { current, isComplete, targetKeys } = useTrainerDerived(state, learningMode)

  // === Utility functions ===
  const safeDecode = useCallback((value: string) => {
    try { return decodeURIComponent(value) } catch { return value }
  }, [])

  const decodeSharedText = useCallback((value: string) => {
    const once = safeDecode(value)
    return /%[0-9A-Fa-f]{2}/.test(once) ? safeDecode(once) : once
  }, [safeDecode])

  const normalizePinyinInput = useCallback((raw: string) => {
    return raw.trim().toLowerCase().replace('u:', 'v').replace('ü', 'v')
  }, [])

  const getSpeed = useCallback(() => {
    if (!isStarted || stats.correct === 0) return 0
    const time = (Date.now() - startTimeRef.current) / 1000 / 60
    return Math.round(stats.correct / time)
  }, [isStarted, stats.correct])

  const getShareUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (inputText) params.set('text', inputText)
    if (learningMode === 'blind') params.set('mode', 'blind')
    if (isTimedMode) params.set('timed', String(timedDuration))
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`
  }, [inputText, learningMode, isTimedMode, timedDuration])

  // === Pinyin editing ===
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
      i === index ? { ...item, pinyin: normalized, initial, final, shuangpin, pinyinSource: item.autoPinyin === normalized ? 'auto' : 'manual' } : item
    )))
    setIsEditingPinyin(false)
    setPinyinDraft('')
    setPinyinEditError('')
    setInputBuffer('')
    setIsError(false)
    setWrongKey(null)
    setCorrectKey(null)
  }, [normalizePinyinInput, setQueue, setIsEditingPinyin, setPinyinDraft, setPinyinEditError, setInputBuffer, setIsError, setWrongKey, setCorrectKey])

  const resetPinyinEdit = useCallback((index: number) => {
    setQueue(q => q.map((item, i) => {
      if (i !== index || !item.autoPinyin) return item
      const normalized = normalizePinyinInput(item.autoPinyin)
      const { initial, final } = parsePinyinParts(normalized)
      return { ...item, pinyin: normalized, initial, final, shuangpin: pinyinToShuangpin(normalized, initial, final), pinyinSource: 'auto' }
    }))
    setIsEditingPinyin(false)
    setPinyinDraft('')
    setPinyinEditError('')
    setInputBuffer('')
    setIsError(false)
    setWrongKey(null)
    setCorrectKey(null)
  }, [normalizePinyinInput, setQueue, setIsEditingPinyin, setPinyinDraft, setPinyinEditError, setInputBuffer, setIsError, setWrongKey, setCorrectKey])

  const openPinyinEditor = useCallback((currentPinyin: string) => {
    setIsEditingPinyin(true)
    setPinyinDraft(currentPinyin)
    setPinyinEditError('')
  }, [setIsEditingPinyin, setPinyinDraft, setPinyinEditError])

  const cancelPinyinEdit = useCallback(() => {
    setIsEditingPinyin(false)
    setPinyinEditError('')
  }, [setIsEditingPinyin, setPinyinEditError])

  // === Practice functions ===
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
  }, [isTimedMode, timedDuration, setQueue, setCurrentIndex, setInputBuffer, setIsError, setWrongKey, setCorrectKey, setIsEditingPinyin, setPinyinDraft, setPinyinEditError, setIsStarted, setStats, setFollowMode, setTimeLeft])

  const randomLocalText = useCallback(() => {
    const text = getRandomText()
    setInputText(text)
    startPractice(text)
  }, [setInputText, startPractice])

  const fetchOnlineText = useCallback(async () => {
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
  }, [setIsLoading, setInputText, startPractice, randomLocalText])

  const randomText = useCallback(() => {
    if (textSource === 'online') fetchOnlineText()
    else randomLocalText()
  }, [textSource, fetchOnlineText, randomLocalText])

  // === Key input handling ===
  const handleKeyInput = useCallback((key: string) => {
    if (!isStarted || currentIndex >= queue.length) return
    if (isTimedMode && timeLeft <= 0) return

    const currentChar = queue[currentIndex]
    const target = currentChar.shuangpin.toLowerCase()
    const fullPinyin = currentChar.pinyin.toLowerCase()
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
      saveErrorRecord(currentChar.char, currentChar.pinyin, currentChar.shuangpin, true)
      setInputBuffer('')
      setTimeout(() => { setIsError(false); setWrongKey(null); setCorrectKey(null) }, 500)
      return
    }

    const isCharComplete = matches.some(seq => seq.length === nextBuffer.length)
    if (isCharComplete) {
      if (soundEnabled) playSuccessSound()
      setStats(s => ({ ...s, correct: s.correct + 1 }))
      saveErrorRecord(currentChar.char, currentChar.pinyin, currentChar.shuangpin, false)
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
  }, [isStarted, currentIndex, queue, inputBuffer, soundEnabled, isTimedMode, timeLeft, allowShortFullPinyin, setLastPressedKey, incrementKeyPressId, setIsError, setWrongKey, setCorrectKey, setStats, setInputBuffer, setCurrentIndex])

  const skipCurrentChar = useCallback(() => {
    if (!isStarted || currentIndex >= queue.length) return
    setStats(s => ({ ...s, errors: s.errors + 1 }))
    setCurrentIndex(i => i + 1)
    setInputBuffer('')
    setIsError(false)
    setWrongKey(null)
    setCorrectKey(null)
  }, [isStarted, currentIndex, queue.length, setStats, setCurrentIndex, setInputBuffer, setIsError, setWrongKey, setCorrectKey])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) return

    if (e.key === 'Escape') { e.preventDefault(); setIsStarted(false); return }
    if (e.key === 'Tab') { e.preventDefault(); skipCurrentChar(); return }
    if (e.key === ' ') { e.preventDefault(); randomText(); return }
    if (e.key === 'Backspace') {
      if (!isStarted || inputBuffer.length === 0) return
      e.preventDefault()
      setInputBuffer(buffer => buffer.slice(0, -1))
      setIsError(false)
      setWrongKey(null)
      setCorrectKey(null)
      return
    }

    const key = e.key.toLowerCase()
    if (!/^[a-z]$/.test(key)) return
    e.preventDefault()
    handleKeyInput(key)
  }, [handleKeyInput, inputBuffer.length, isStarted, skipCurrentChar, randomText, setIsStarted, setInputBuffer, setIsError, setWrongKey, setCorrectKey])

  // === Effects ===
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlText = params.get('text')
    const urlMode = params.get('mode')
    const urlTimed = params.get('timed')
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
  }, [decodeSharedText, setInputText, setLearningMode, setIsTimedMode, setTimedDuration, setTimeLeft, setShowTutorial, startPractice])

  useEffect(() => {
    if (!soundEnabled) return
    const handleFirstInteraction = () => activateAudio()
    window.addEventListener('pointerdown', handleFirstInteraction, { once: true })
    window.addEventListener('keydown', handleFirstInteraction, { once: true })
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
    }
  }, [soundEnabled])

  useEffect(() => {
    if (isTimedMode && isStarted && !isComplete && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
      return () => clearInterval(timer)
    }
  }, [isTimedMode, isStarted, isComplete, timeLeft, setTimeLeft])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isComplete && stats.correct > 0) {
      const time = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const accuracy = (stats.correct / (stats.correct + stats.errors)) * 100
      const speed = time > 0 ? Math.round(stats.correct / (time / 60)) : 0
      updatePracticeStats(stats.correct, stats.errors, time)
      saveDailyRecord(stats.correct, stats.errors, time)
      const unlocked = checkAndUnlockAchievements(accuracy, speed)
      if (unlocked.length > 0) {
        setNewAchievements(unlocked)
        setTimeout(() => setNewAchievements([]), 5000)
      }
    }
  }, [isComplete, stats, setNewAchievements])

  useEffect(() => {
    if (isComplete && autoNext && !isTimedMode) {
      const timer = setTimeout(() => randomText(), 1500)
      return () => clearTimeout(timer)
    }
  }, [isComplete, autoNext, isTimedMode, randomText])

  useEffect(() => {
    setIsEditingPinyin(false)
    setPinyinDraft('')
    setPinyinEditError('')
  }, [currentIndex, setIsEditingPinyin, setPinyinDraft, setPinyinEditError])

  // === Render ===
  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-6 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <HeaderBar
          theme={theme}
          darkMode={darkMode}
          autoNext={autoNext}
          soundEnabled={soundEnabled}
          onToggleTutorial={() => setShowTutorial(true)}
          onToggleStats={() => setShowStats(true)}
          onToggleLookup={() => setShowLookup(true)}
          onToggleAutoNext={() => setAutoNext(!autoNext)}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <ModeSelector
          theme={theme}
          learningMode={learningMode}
          setLearningMode={setLearningMode}
          isTimedMode={isTimedMode}
          setIsTimedMode={setIsTimedMode}
          timedDuration={timedDuration}
          setTimedDuration={setTimedDuration}
          timeLeft={timeLeft}
          setTimeLeft={setTimeLeft}
          allowShortFullPinyin={allowShortFullPinyin}
          setAllowShortFullPinyin={setAllowShortFullPinyin}
          soundPackId={soundPackId}
          setSoundPackId={setSoundPackId}
          keyVolume={keyVolume}
          setKeyVolume={setKeyVolume}
          successVolume={successVolume}
          setSuccessVolume={setSuccessVolume}
          errorVolume={errorVolume}
          setErrorVolume={setErrorVolume}
          soundEnabled={soundEnabled}
          isStarted={isStarted}
          isComplete={isComplete}
          speed={getSpeed()}
          onOpenPracticeMode={() => setShowPracticeMode(true)}
        />

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

        {isStarted && current && !isComplete && (
          <CurrentCharPanel
            theme={theme}
            current={current}
            currentIndex={currentIndex}
            inputBuffer={inputBuffer}
            isError={isError}
            wrongKey={wrongKey}
            correctKey={correctKey}
            learningMode={learningMode}
            isEditingPinyin={isEditingPinyin}
            pinyinDraft={pinyinDraft}
            pinyinEditError={pinyinEditError}
            setPinyinDraft={setPinyinDraft}
            onOpenPinyinEditor={openPinyinEditor}
            onApplyPinyinEdit={applyPinyinEdit}
            onResetPinyinEdit={resetPinyinEdit}
            onCancelPinyinEdit={cancelPinyinEdit}
          />
        )}

        {isComplete && (
          <CompletionPanel
            theme={theme}
            stats={stats}
            isTimedMode={isTimedMode}
            timeLeft={timeLeft}
            autoNext={autoNext}
            speed={getSpeed()}
            shareUrl={getShareUrl()}
            onOpenStats={() => setShowStats(true)}
            onOpenPracticeMode={() => setShowPracticeMode(true)}
          />
        )}

        <AchievementToast achievements={newAchievements} />

        {isStarted && (
          <ProgressPanel
            theme={theme}
            queue={queue}
            currentIndex={currentIndex}
            stats={stats}
            isError={isError}
            followMode={followMode}
            isComplete={isComplete}
            inputText={inputText}
          />
        )}

        <InputArea
          theme={theme}
          inputText={inputText}
          isLoading={isLoading}
          textSource={textSource}
          onStartPractice={startPractice}
          onRandomText={randomText}
          onOpenCustomText={() => setShowCustomText(true)}
          setInputText={setInputText}
          setTextSource={setTextSource}
        />
      </div>

      {/* Modals */}
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
      {showLookup && <ShuangpinLookup onClose={() => setShowLookup(false)} darkMode={darkMode} />}
      {showCustomText && (
        <CustomTextModal
          onStart={(text, mode) => { setInputText(text); startPractice(text, mode === 'follow') }}
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
