export type TilesetId = number;

export interface Tileset {
  id: TilesetId;
  image: HTMLImageElement;
  tileW: number;
  tileH: number;
  cols: number;
  rows: number;
  properties: Map<number, Map<string, unknown>>;
}

const _tilesets = new Map<TilesetId, Tileset>();
let _nextId = 1;

export async function load(url: string, tileW: number, tileH: number): Promise<TilesetId> {
  const id = _nextId++;
  const image = new Image();
  await new Promise<void>((res, rej) => {
    image.onload = () => res();
    image.onerror = rej;
    image.src = url;
  });
  _tilesets.set(id, {
    id, image, tileW, tileH,
    cols: Math.floor(image.width / tileW),
    rows: Math.floor(image.height / tileH),
    properties: new Map(),
  });
  return id;
}

export function tileCount(id: TilesetId): number {
  const ts = _tilesets.get(id);
  if (!ts) return 0;
  return ts.cols * ts.rows;
}

export function setProperty(id: TilesetId, index: number, key: string, value: unknown): void {
  const ts = _tilesets.get(id);
  if (!ts) return;
  if (!ts.properties.has(index)) ts.properties.set(index, new Map());
  ts.properties.get(index)!.set(key, value);
}

export function getProperty(id: TilesetId, index: number, key: string): unknown {
  return _tilesets.get(id)?.properties.get(index)?.get(key);
}

export function get(id: TilesetId): Tileset | undefined {
  return _tilesets.get(id);
}
