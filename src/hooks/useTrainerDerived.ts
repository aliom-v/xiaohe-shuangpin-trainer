import { useMemo } from 'react'
import type { TrainerState } from '@/hooks/useTrainerState'
import type { LearningMode } from '@/hooks/useTrainerSettings'

export function useTrainerDerived(state: TrainerState, learningMode: LearningMode) {
  const current = useMemo(() => {
    return state.queue[state.currentIndex]
  }, [state.queue, state.currentIndex])

  const isComplete = useMemo(() => {
    return state.isStarted
      && (state.currentIndex >= state.queue.length || (state.isTimedMode && state.timeLeft <= 0))
  }, [state.isStarted, state.currentIndex, state.queue.length, state.isTimedMode, state.timeLeft])

  const showHintKeys = useMemo(() => {
    return !!current
      && !isComplete
      && learningMode === 'hint'
      && (!state.inputBuffer || current.shuangpin.startsWith(state.inputBuffer))
  }, [current, isComplete, learningMode, state.inputBuffer])

  const targetKeys = useMemo(() => {
    return showHintKeys && current
      ? [current.shuangpin[0], current.shuangpin[1]] as [string, string]
      : null
  }, [current, showHintKeys])

  return {
    current,
    isComplete,
    showHintKeys,
    targetKeys,
  }
}
