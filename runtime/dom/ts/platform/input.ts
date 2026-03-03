export type PointerHandler = (x: number, y: number, button: number) => void;
export type KeyHandler = (key: string) => void;

export function onPointerDown(el: Element, cb: PointerHandler): void {
  el.addEventListener("pointerdown", (e) => {
    const pe = e as PointerEvent;
    cb(pe.clientX, pe.clientY, pe.button);
  });
}

export function onPointerMove(el: Element, cb: PointerHandler): void {
  el.addEventListener("pointermove", (e) => {
    const pe = e as PointerEvent;
    cb(pe.clientX, pe.clientY, pe.button);
  });
}

export function onPointerUp(el: Element, cb: PointerHandler): void {
  el.addEventListener("pointerup", (e) => {
    const pe = e as PointerEvent;
    cb(pe.clientX, pe.clientY, pe.button);
  });
}

export function onKeyDown(cb: KeyHandler): void {
  document.addEventListener("keydown", (e) => cb(e.key));
}

export function onKeyUp(cb: KeyHandler): void {
  document.addEventListener("keyup", (e) => cb(e.key));
}
