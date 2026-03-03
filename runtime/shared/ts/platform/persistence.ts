export function save(key: string, data: string): void {
  try { localStorage.setItem(key, data); } catch {}
}

export function load(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}

export function remove(key: string): void {
  try { localStorage.removeItem(key); } catch {}
}
