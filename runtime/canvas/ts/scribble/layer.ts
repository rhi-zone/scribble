export type LayerId = number;
export type DrawFn = (ctx: CanvasRenderingContext2D) => void;

export interface Layer {
  id: LayerId;
  z: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  draw: DrawFn;
  visible: boolean;
  offsetX: number;
  offsetY: number;
}

const _layers = new Map<LayerId, Layer>();
let _nextId = 1;
let _container: HTMLElement | null = null;
let _width = 0;
let _height = 0;

export function initLayers(container: HTMLElement, width: number, height: number): void {
  _container = container;
  _width = width;
  _height = height;
}

export function createLayer(z: number, draw: DrawFn): LayerId {
  const id = _nextId++;
  const canvas = document.createElement("canvas");
  canvas.width = _width;
  canvas.height = _height;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  _container?.appendChild(canvas);
  _layers.set(id, {
    id, z, canvas,
    ctx: canvas.getContext("2d")!,
    draw, visible: true,
    offsetX: 0, offsetY: 0,
  });
  return id;
}

export function removeLayer(id: LayerId): void {
  const layer = _layers.get(id);
  if (layer) {
    layer.canvas.remove();
    _layers.delete(id);
  }
}

export function setZ(id: LayerId, z: number): void {
  const l = _layers.get(id);
  if (l) l.z = z;
}

export function setVisible(id: LayerId, visible: boolean): void {
  const l = _layers.get(id);
  if (!l) return;
  l.visible = visible;
  l.canvas.style.display = visible ? "" : "none";
}

export function setOffset(id: LayerId, x: number, y: number): void {
  const l = _layers.get(id);
  if (l) { l.offsetX = x; l.offsetY = y; }
}

export function drawAll(): void {
  const sorted = [..._layers.values()]
    .filter((l) => l.visible)
    .sort((a, b) => a.z - b.z);
  for (const layer of sorted) {
    layer.ctx.clearRect(0, 0, _width, _height);
    if (layer.offsetX !== 0 || layer.offsetY !== 0) {
      layer.ctx.save();
      layer.ctx.translate(layer.offsetX, layer.offsetY);
      layer.draw(layer.ctx);
      layer.ctx.restore();
    } else {
      layer.draw(layer.ctx);
    }
  }
}
