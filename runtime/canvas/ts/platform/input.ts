const _keys = new Set<string>();
let _mouseX = 0;
let _mouseY = 0;
const _mouseDown = new Set<number>();
const _mousePressed = new Set<number>();
const _mouseReleased = new Set<number>();
const _keysPressed = new Set<string>();
const _keysReleased = new Set<string>();

export function initInput(canvas: HTMLCanvasElement): void {
  document.addEventListener("keydown", (e) => { _keys.add(e.key); _keysPressed.add(e.key); });
  document.addEventListener("keyup", (e) => { _keys.delete(e.key); _keysReleased.add(e.key); });
  canvas.addEventListener("mousemove", (e) => { _mouseX = e.offsetX; _mouseY = e.offsetY; });
  canvas.addEventListener("mousedown", (e) => { _mouseDown.add(e.button); _mousePressed.add(e.button); });
  canvas.addEventListener("mouseup", (e) => { _mouseDown.delete(e.button); _mouseReleased.add(e.button); });
}

export function flushInput(): void {
  _keysPressed.clear();
  _keysReleased.clear();
  _mousePressed.clear();
  _mouseReleased.clear();
}

export function isKeyDown(key: string): boolean { return _keys.has(key); }
export function isKeyPressed(key: string): boolean { return _keysPressed.has(key); }
export function isKeyReleased(key: string): boolean { return _keysReleased.has(key); }
export function isMouseDown(button: number): boolean { return _mouseDown.has(button); }
export function isMousePressed(button: number): boolean { return _mousePressed.has(button); }
export function isMouseReleased(button: number): boolean { return _mouseReleased.has(button); }
export function mouseX(): number { return _mouseX; }
export function mouseY(): number { return _mouseY; }
