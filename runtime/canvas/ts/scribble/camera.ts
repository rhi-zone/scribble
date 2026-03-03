export type CameraId = number;

export interface Camera {
  id: CameraId;
  x: number;
  y: number;
  zoom: number;
}

const _cameras = new Map<CameraId, Camera>();
let _nextId = 1;

export function create(x = 0, y = 0, zoom = 1): CameraId {
  const id = _nextId++;
  _cameras.set(id, { id, x, y, zoom });
  return id;
}

export function move(id: CameraId, dx: number, dy: number): void {
  const c = _cameras.get(id);
  if (c) { c.x += dx; c.y += dy; }
}

export function setZoom(id: CameraId, zoom: number): void {
  const c = _cameras.get(id);
  if (c) c.zoom = zoom;
}

export function screenToWorld(id: CameraId, sx: number, sy: number, canvasW: number, canvasH: number): [number, number] {
  const c = _cameras.get(id)!;
  return [(sx - canvasW / 2) / c.zoom + c.x, (sy - canvasH / 2) / c.zoom + c.y];
}

export function worldToScreen(id: CameraId, wx: number, wy: number, canvasW: number, canvasH: number): [number, number] {
  const c = _cameras.get(id)!;
  return [(wx - c.x) * c.zoom + canvasW / 2, (wy - c.y) * c.zoom + canvasH / 2];
}

export function screenToTile(id: CameraId, sx: number, sy: number, tileW: number, tileH: number, canvasW: number, canvasH: number): [number, number] {
  const [wx, wy] = screenToWorld(id, sx, sy, canvasW, canvasH);
  return [Math.floor(wx / tileW), Math.floor(wy / tileH)];
}

export function get(id: CameraId): Camera | undefined { return _cameras.get(id); }
