'use client'

import { useEffect, useState } from 'react'
import {
  getSoundPacks,
  setSoundPack,
  setKeyVolume as applyKeyVolume,
  setSuccessVolume as applySuccessVolume,
  setErrorVolume as applyErrorVolume,
} from '@/lib/sound'

export type LearningMode = 'normal' | 'hint' | 'blind' | 'timed'
export type TextSource = 'local' | 'online'

const DEFAULT_SOUND_VOLUME = 1
const LEARNING_MODES: LearningMode[] = ['normal', 'hint', 'blind', 'timed']
const TEXT_SOURCES: TextSource[] = ['local', 'online']

function parseStoredNumber(value: string | null) {
  if (value === null) return null
  const parsed = Number.parseFloat(value)
  return Number.isNaN(parsed) ? null : parsed
}

function isLearningMode(value: string): value is LearningMode {
  return LEARNING_MODES.includes(value as LearningMode)
}

function isTextSource(value: string): value is TextSource {
  return TEXT_SOURCES.includes(value as TextSource)
}

export function useTrainerSettings() {
  const [darkMode, setDarkMode] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundPackId, setSoundPackId] = useState('synth')
  const [keyVolume, setKeyVolume] = useState(DEFAULT_SOUND_VOLUME)
  const [successVolume, setSuccessVolume] = useState(DEFAULT_SOUND_VOLUME)
  const [errorVolume, setErrorVolume] = useState(DEFAULT_SOUND_VOLUME)
  const [learningMode, setLearningMode] = useState<LearningMode>('hint')
  const [textSource, setTextSource] = useState<TextSource>('local')
  const [allowShortFullPinyin, setAllowShortFullPinyin] = useState(true)
  const [settingsReady, setSettingsReady] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('shuangpin_darkMode')
    const savedSound = localStorage.getItem('shuangpin_sound')
    const savedMode = localStorage.getItem('shuangpin_mode')
    const savedSource = localStorage.getItem('shuangpin_source')
    const savedAllowShortFull = localStorage.getItem('shuangpin_allow_short_fullpinyin')
    const savedSoundPack = localStorage.getItem('shuangpin_sound_pack')
    const savedKeyVolume = localStorage.getItem('shuangpin_sound_volume_key')
    const savedSuccessVolume = localStorage.getItem('shuangpin_sound_volume_success')
    const savedErrorVolume = localStorage.getItem('shuangpin_sound_volume_error')
    const savedLegacyVolume = localStorage.getItem('shuangpin_sound_volume')

    if (savedDarkMode !== null) setDarkMode(savedDarkMode === 'true')
    if (savedSound !== null) setSoundEnabled(savedSound === 'true')
    if (savedMode && isLearningMode(savedMode)) setLearningMode(savedMode)
    if (savedSource && isTextSource(savedSource)) setTextSource(savedSource)
    if (savedAllowShortFull !== null) setAllowShortFullPinyin(savedAllowShortFull === 'true')

    if (savedSoundPack) {
      const availablePacks = getSoundPacks()
      if (availablePacks.some(pack => pack.id === savedSoundPack)) {
        setSoundPackId(savedSoundPack)
      } else {
        setSoundPackId(availablePacks[0]?.id ?? 'synth')
      }
    }

    const parsedKeyVolume = parseStoredNumber(savedKeyVolume)
    const parsedSuccessVolume = parseStoredNumber(savedSuccessVolume)
    const parsedErrorVolume = parseStoredNumber(savedErrorVolume)
    const parsedLegacyVolume = parseStoredNumber(savedLegacyVolume)

    if (parsedKeyVolume !== null) setKeyVolume(parsedKeyVolume)
    if (parsedSuccessVolume !== null) setSuccessVolume(parsedSuccessVolume)
    if (parsedErrorVolume !== null) setErrorVolume(parsedErrorVolume)

    if (
      parsedKeyVolume === null
      && parsedSuccessVolume === null
      && parsedErrorVolume === null
      && parsedLegacyVolume !== null
    ) {
      setKeyVolume(parsedLegacyVolume)
      setSuccessVolume(parsedLegacyVolume)
      setErrorVolume(parsedLegacyVolume)
      localStorage.removeItem('shuangpin_sound_volume')
    }

    setSettingsReady(true)
  }, [])

  useEffect(() => {
    if (!settingsReady) return
    localStorage.setItem('shuangpin_darkMode', String(darkMode))
  }, [settingsReady, darkMode])

  useEffect(() => {
    if (!settingsReady) return
    localStorage.setItem('shuangpin_sound', String(soundEnabled))
  }, [settingsReady, soundEnabled])

  useEffect(() => {
    if (!settingsReady) return
    localStorage.setItem('shuangpin_sound_pack', soundPackId)
    setSoundPack(soundPackId)
  }, [settingsReady, soundPackId])

  useEffect(() => {
    if (!settingsReady) return
    localStorage.setItem('shuangpin_sound_volume_key', String(keyVolume))
    localStorage.setItem('shuangpin_sound_volume_success', String(successVolume))
    localStorage.setItem('shuangpin_sound_volume_error', String(errorVolume))
    applyKeyVolume(keyVolume)
    applySuccessVolume(successVolume)
    applyErrorVolume(errorVolume)
  }, [settingsReady, keyVolume, successVolume, errorVolume])

  useEffect(() => {
    if (!settingsReady) return
    localStorage.setItem('shuangpin_mode', learningMode)
  }, [settingsReady, learningMode])

  useEffect(() => {
    if (!settingsReady) return
    localStorage.setItem('shuangpin_source', textSource)
  }, [settingsReady, textSource])

  useEffect(() => {
    if (!settingsReady) return
    localStorage.setItem('shuangpin_allow_short_fullpinyin', String(allowShortFullPinyin))
  }, [settingsReady, allowShortFullPinyin])

  return {
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
  }
}
