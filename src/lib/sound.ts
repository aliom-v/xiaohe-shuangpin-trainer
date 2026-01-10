// 键盘音效引擎（合成 + 开源音效包）
let audioContext: AudioContext | null = null
let compressor: DynamicsCompressorNode | null = null
let hasUserGesture = false
let pendingPackId: string | null = null

function ensureAudioGraph() {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  if (!compressor) {
    compressor = audioContext.createDynamicsCompressor()
    compressor.threshold.value = -20
    compressor.knee.value = 15
    compressor.ratio.value = 6
    compressor.attack.value = 0.003
    compressor.release.value = 0.1
    compressor.connect(audioContext.destination)
  }
}

function getAudioContext() {
  ensureAudioGraph()
  return audioContext!
}

function getActiveAudioContext() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

type SoundPack = {
  id: string
  name: string
  type: 'synth' | 'file'
  files?: string[]
  volume?: number
}

const SOUND_PACKS: SoundPack[] = [
  { id: 'synth', name: '合成', type: 'synth' },
  {
    id: 'mechvibes-turquoise',
    name: '松石（Turquoise）',
    type: 'file',
    files: [
      '/sounds/mechvibes/turquoise/press/GENERIC_R0.mp3',
      '/sounds/mechvibes/turquoise/press/GENERIC_R1.mp3',
      '/sounds/mechvibes/turquoise/press/GENERIC_R2.mp3',
      '/sounds/mechvibes/turquoise/press/GENERIC_R3.mp3',
      '/sounds/mechvibes/turquoise/press/GENERIC_R4.mp3',
    ],
    volume: 0.85,
  },
  {
    id: 'mechvibes-cream-travel',
    name: '奶油旅行（Cream Travel）',
    type: 'file',
    files: [
      '/sounds/mechvibes/cream-travel/press/GENERIC_R0.mp3',
      '/sounds/mechvibes/cream-travel/press/GENERIC_R1.mp3',
      '/sounds/mechvibes/cream-travel/press/GENERIC_R2.mp3',
      '/sounds/mechvibes/cream-travel/press/GENERIC_R3.mp3',
      '/sounds/mechvibes/cream-travel/press/GENERIC_R4.mp3',
    ],
    volume: 0.85,
  },
  {
    id: 'mechvibes-holy-pandas',
    name: '圣熊猫（Holy Pandas）',
    type: 'file',
    files: [
      '/sounds/mechvibes/holy-pandas/GENERIC_R0.mp3',
      '/sounds/mechvibes/holy-pandas/GENERIC_R1.mp3',
      '/sounds/mechvibes/holy-pandas/GENERIC_R2.mp3',
      '/sounds/mechvibes/holy-pandas/GENERIC_R3.mp3',
      '/sounds/mechvibes/holy-pandas/GENERIC_R4.mp3',
    ],
    volume: 0.85,
  },
]

const packBufferCache = new Map<string, AudioBuffer[]>()
const packLoadPromises = new Map<string, Promise<void>>()
let currentPackId = 'synth'

const MAX_SOUND_VOLUME = 2
let keyVolume = 1
let successVolume = 1
let errorVolume = 1

function clampVolume(value: number) {
  if (!Number.isFinite(value)) return 1
  return Math.min(Math.max(value, 0), MAX_SOUND_VOLUME)
}

export function setKeyVolume(value: number) {
  keyVolume = clampVolume(value)
}

export function setSuccessVolume(value: number) {
  successVolume = clampVolume(value)
}

export function setErrorVolume(value: number) {
  errorVolume = clampVolume(value)
}

export function activateAudio() {
  hasUserGesture = true
  const ctx = getActiveAudioContext()
  const packId = pendingPackId ?? currentPackId
  pendingPackId = null
  void loadSoundPack(packId)
  return ctx
}

export function getSoundPacks() {
  return SOUND_PACKS
}

export function getCurrentSoundPackId() {
  return currentPackId
}

export function setSoundPack(id: string) {
  const pack = SOUND_PACKS.find(p => p.id === id)
  if (!pack) {
    currentPackId = 'synth'
    return Promise.resolve()
  }
  currentPackId = id
  if (!hasUserGesture) {
    pendingPackId = id
    return Promise.resolve()
  }
  return loadSoundPack(id)
}

async function loadSoundPack(id: string) {
  const pack = SOUND_PACKS.find(p => p.id === id)
  if (!pack || pack.type !== 'file' || !pack.files) return Promise.resolve()
  if (!hasUserGesture) {
    pendingPackId = id
    return Promise.resolve()
  }
  if (packBufferCache.has(id)) return Promise.resolve()
  const existing = packLoadPromises.get(id)
  if (existing) return existing

  const ctx = getAudioContext()
  const promise = Promise.all(
    pack.files.map(async (file) => {
      const res = await fetch(file)
      if (!res.ok) throw new Error(`Failed to load sound: ${file}`)
      const data = await res.arrayBuffer()
      return ctx.decodeAudioData(data)
    }),
  ).then((buffers) => {
    packBufferCache.set(id, buffers)
  }).catch(() => {
    packBufferCache.delete(id)
  }).finally(() => {
    packLoadPromises.delete(id)
  })

  packLoadPromises.set(id, promise)
  return promise
}

type KeySoundKind = 'key' | 'success'

function getOutputNode() {
  ensureAudioGraph()
  return compressor!
}

function getKeyVolume(kind: KeySoundKind) {
  return kind === 'success' ? successVolume : keyVolume
}

function playSynthKeySound(volumeScale: number) {
  const ctx = activateAudio()
  
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  
  osc.connect(filter)
  filter.connect(gain)
  gain.connect(getOutputNode())
  
  osc.type = 'square'
  osc.frequency.setValueAtTime(1800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.02)
  
  filter.type = 'lowpass'
  filter.frequency.value = 1800
  
  gain.gain.setValueAtTime(0.85 * volumeScale, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
  
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.03)
}

export function playSuccessSound() {
  playKeySound('success')
}

export function playKeySound(kind: KeySoundKind = 'key') {
  const volumeScale = getKeyVolume(kind)
  const pack = SOUND_PACKS.find(p => p.id === currentPackId) || SOUND_PACKS[0]
  if (pack.type === 'synth') {
    playSynthKeySound(volumeScale)
    return
  }
  const buffers = packBufferCache.get(pack.id)
  if (!buffers || buffers.length === 0) {
    loadSoundPack(pack.id)
    playSynthKeySound(volumeScale)
    return
  }
  const ctx = activateAudio()
  const buffer = buffers[Math.floor(Math.random() * buffers.length)]
  const source = ctx.createBufferSource()
  const gain = ctx.createGain()
  source.buffer = buffer
  source.playbackRate.value = 0.98 + Math.random() * 0.04
  gain.gain.value = (pack.volume ?? 0.6) * volumeScale
  source.connect(gain)
  gain.connect(getOutputNode())
  source.start()
}

export function playErrorSound() {
  const ctx = activateAudio()
  
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  
  osc.type = 'sine'
  osc.frequency.value = 200
  
  gain.gain.setValueAtTime(0.4 * errorVolume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
  
  osc.connect(gain)
  gain.connect(getOutputNode())
  
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.15)
}

