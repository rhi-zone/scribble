let _ctx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  return _ctx;
}

const _buffers = new Map<number, AudioBuffer>();
let _nextBufferId = 1;

export async function loadBuffer(url: string): Promise<number> {
  const id = _nextBufferId++;
  const res = await fetch(url);
  const arr = await res.arrayBuffer();
  _buffers.set(id, await ctx().decodeAudioData(arr));
  return id;
}

export function playSfx(bufferId: number, volume = 1, pitch = 1): void {
  const buf = _buffers.get(bufferId);
  if (!buf) return;
  const src = ctx().createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = pitch;
  const gain = ctx().createGain();
  gain.gain.value = volume;
  src.connect(gain).connect(ctx().destination);
  src.start();
}

let _musicSource: AudioBufferSourceNode | null = null;
let _musicGain: GainNode | null = null;

export function playMusic(bufferId: number, volume = 1, loop = true): void {
  stopMusic();
  const buf = _buffers.get(bufferId);
  if (!buf) return;
  _musicSource = ctx().createBufferSource();
  _musicSource.buffer = buf;
  _musicSource.loop = loop;
  _musicGain = ctx().createGain();
  _musicGain.gain.value = volume;
  _musicSource.connect(_musicGain).connect(ctx().destination);
  _musicSource.start();
}

export function stopMusic(): void {
  _musicSource?.stop();
  _musicSource = null;
  _musicGain = null;
}

export function setMusicVolume(volume: number): void {
  if (_musicGain) _musicGain.gain.value = volume;
}
