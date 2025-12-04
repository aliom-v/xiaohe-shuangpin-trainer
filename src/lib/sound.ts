// 使用预录制的机械键盘音效 (Base64 编码的短音频)
let audioContext: AudioContext | null = null
let keyBuffer: AudioBuffer | null = null
let errorBuffer: AudioBuffer | null = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

// 简单的点击音 - 用更自然的方式合成
export function playKeySound() {
  const ctx = getAudioContext()
  
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  
  osc.type = 'square'
  osc.frequency.setValueAtTime(1800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02)
  
  filter.type = 'lowpass'
  filter.frequency.value = 1800
  
  gain.gain.setValueAtTime(0.25, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
  
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.03)
}

export function playSuccessSound() {
  playKeySound()
}

export function playErrorSound() {
  const ctx = getAudioContext()
  
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.type = 'sine'
  osc.frequency.value = 200
  
  gain.gain.setValueAtTime(0.4, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
  
  osc.connect(gain)
  gain.connect(ctx.destination)
  
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.15)
}

export function playCompleteSound() {
  const ctx = getAudioContext()
  const notes = [523, 659, 784, 1047]
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = freq
    
    const t = ctx.currentTime + i * 0.1
    gain.gain.setValueAtTime(0.25, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start(t)
    osc.stop(t + 0.3)
  })
}
