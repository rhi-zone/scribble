export function scheduleTimeout(callback: () => void, ms: number): number {
  return setTimeout(callback, ms) as unknown as number;
}

export function cancelTimeout(id: number): void {
  clearTimeout(id);
}

export function scheduleInterval(callback: () => void, ms: number): number {
  return setInterval(callback, ms) as unknown as number;
}

export function cancelInterval(id: number): void {
  clearInterval(id);
}

export function requestFrame(callback: (dt: number) => void): number {
  let last = performance.now();
  function tick(now: number) {
    const dt = (now - last) / 1000;
    last = now;
    callback(dt);
    requestAnimationFrame(tick);
  }
  return requestAnimationFrame(tick);
}
