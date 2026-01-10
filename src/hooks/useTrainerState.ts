import { useCallback, useReducer } from 'react'
import type { CharInfo } from '@/lib/xiaohe'
import type { Achievement } from '@/lib/learning'

export interface TrainerState {
  inputText: string
  queue: CharInfo[]
  currentIndex: number
  inputBuffer: string
  isError: boolean
  isStarted: boolean
  stats: { correct: number; errors: number }
  lastPressedKey: string | null
  keyPressId: number
  autoNext: boolean
  isLoading: boolean
  showTutorial: boolean
  showPracticeMode: boolean
  showStats: boolean
  showLookup: boolean
  showCustomText: boolean
  followMode: boolean
  timeLeft: number
  isTimedMode: boolean
  timedDuration: number
  wrongKey: string | null
  correctKey: string | null
  isEditingPinyin: boolean
  pinyinDraft: string
  pinyinEditError: string
  newAchievements: Achievement[]
}

type TrainerAction =
  | { type: 'patch'; payload: Partial<TrainerState> }
  | { type: 'updateQueue'; updater: (prev: CharInfo[]) => CharInfo[] }
  | { type: 'updateCurrentIndex'; updater: (prev: number) => number }
  | { type: 'updateInputBuffer'; updater: (prev: string) => string }
  | { type: 'updateStats'; updater: (prev: TrainerState['stats']) => TrainerState['stats'] }
  | { type: 'updateTimeLeft'; updater: (prev: number) => number }
  | { type: 'incrementKeyPressId' }

const initialState: TrainerState = {
  inputText: '',
  queue: [],
  currentIndex: 0,
  inputBuffer: '',
  isError: false,
  isStarted: false,
  stats: { correct: 0, errors: 0 },
  lastPressedKey: null,
  keyPressId: 0,
  autoNext: true,
  isLoading: false,
  showTutorial: false,
  showPracticeMode: false,
  showStats: false,
  showLookup: false,
  showCustomText: false,
  followMode: false,
  timeLeft: 60,
  isTimedMode: false,
  timedDuration: 60,
  wrongKey: null,
  correctKey: null,
  isEditingPinyin: false,
  pinyinDraft: '',
  pinyinEditError: '',
  newAchievements: [],
}

function reducer(state: TrainerState, action: TrainerAction): TrainerState {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.payload }
    case 'updateQueue':
      return { ...state, queue: action.updater(state.queue) }
    case 'updateCurrentIndex':
      return { ...state, currentIndex: action.updater(state.currentIndex) }
    case 'updateInputBuffer':
      return { ...state, inputBuffer: action.updater(state.inputBuffer) }
    case 'updateStats':
      return { ...state, stats: action.updater(state.stats) }
    case 'updateTimeLeft':
      return { ...state, timeLeft: action.updater(state.timeLeft) }
    case 'incrementKeyPressId':
      return { ...state, keyPressId: state.keyPressId + 1 }
    default:
      return state
  }
}

export function useTrainerState() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setInputText = useCallback((value: string) => {
    dispatch({ type: 'patch', payload: { inputText: value } })
  }, [])
  const setQueue = useCallback((value: CharInfo[] | ((prev: CharInfo[]) => CharInfo[])) => {
    if (typeof value === 'function') {
      dispatch({ type: 'updateQueue', updater: value })
      return
    }
    dispatch({ type: 'patch', payload: { queue: value } })
  }, [])
  const setCurrentIndex = useCallback((value: number | ((prev: number) => number)) => {
    if (typeof value === 'function') {
      dispatch({ type: 'updateCurrentIndex', updater: value })
      return
    }
    dispatch({ type: 'patch', payload: { currentIndex: value } })
  }, [])
  const setInputBuffer = useCallback((value: string | ((prev: string) => string)) => {
    if (typeof value === 'function') {
      dispatch({ type: 'updateInputBuffer', updater: value })
      return
    }
    dispatch({ type: 'patch', payload: { inputBuffer: value } })
  }, [])
  const setIsError = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { isError: value } })
  }, [])
  const setIsStarted = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { isStarted: value } })
  }, [])
  const setStats = useCallback((value: TrainerState['stats'] | ((prev: TrainerState['stats']) => TrainerState['stats'])) => {
    if (typeof value === 'function') {
      dispatch({ type: 'updateStats', updater: value })
      return
    }
    dispatch({ type: 'patch', payload: { stats: value } })
  }, [])
  const setLastPressedKey = useCallback((value: string | null) => {
    dispatch({ type: 'patch', payload: { lastPressedKey: value } })
  }, [])
  const incrementKeyPressId = useCallback(() => {
    dispatch({ type: 'incrementKeyPressId' })
  }, [])
  const setAutoNext = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { autoNext: value } })
  }, [])
  const setIsLoading = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { isLoading: value } })
  }, [])
  const setShowTutorial = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { showTutorial: value } })
  }, [])
  const setShowPracticeMode = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { showPracticeMode: value } })
  }, [])
  const setShowStats = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { showStats: value } })
  }, [])
  const setShowLookup = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { showLookup: value } })
  }, [])
  const setShowCustomText = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { showCustomText: value } })
  }, [])
  const setFollowMode = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { followMode: value } })
  }, [])
  const setTimeLeft = useCallback((value: number | ((prev: number) => number)) => {
    if (typeof value === 'function') {
      dispatch({ type: 'updateTimeLeft', updater: value })
      return
    }
    dispatch({ type: 'patch', payload: { timeLeft: value } })
  }, [])
  const setIsTimedMode = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { isTimedMode: value } })
  }, [])
  const setTimedDuration = useCallback((value: number) => {
    dispatch({ type: 'patch', payload: { timedDuration: value } })
  }, [])
  const setWrongKey = useCallback((value: string | null) => {
    dispatch({ type: 'patch', payload: { wrongKey: value } })
  }, [])
  const setCorrectKey = useCallback((value: string | null) => {
    dispatch({ type: 'patch', payload: { correctKey: value } })
  }, [])
  const setIsEditingPinyin = useCallback((value: boolean) => {
    dispatch({ type: 'patch', payload: { isEditingPinyin: value } })
  }, [])
  const setPinyinDraft = useCallback((value: string) => {
    dispatch({ type: 'patch', payload: { pinyinDraft: value } })
  }, [])
  const setPinyinEditError = useCallback((value: string) => {
    dispatch({ type: 'patch', payload: { pinyinEditError: value } })
  }, [])
  const setNewAchievements = useCallback((value: Achievement[]) => {
    dispatch({ type: 'patch', payload: { newAchievements: value } })
  }, [])

  return {
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
  }
}
