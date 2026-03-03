import type { TilesetId } from "./tileset";

export type TilemapId = number;
export type TileRef = { tileset: TilesetId; index: number } | null;

export interface Tilemap {
  id: TilemapId;
  width: number;
  height: number;
  tiles: TileRef[];
}

const _tilemaps = new Map<TilemapId, Tilemap>();
let _nextId = 1;

export function create(width: number, height: number): TilemapId {
  const id = _nextId++;
  _tilemaps.set(id, { id, width, height, tiles: new Array(width * height).fill(null) });
  return id;
}

export function get(map: TilemapId, x: number, y: number): TileRef {
  const tm = _tilemaps.get(map);
  if (!tm || x < 0 || y < 0 || x >= tm.width || y >= tm.height) return null;
  return tm.tiles[y * tm.width + x];
}

export function set(map: TilemapId, x: number, y: number, tileset: TilesetId, index: number): void {
  const tm = _tilemaps.get(map);
  if (!tm || x < 0 || y < 0 || x >= tm.width || y >= tm.height) return;
  tm.tiles[y * tm.width + x] = { tileset, index };
}

export function clear(map: TilemapId, x: number, y: number): void {
  const tm = _tilemaps.get(map);
  if (!tm) return;
  tm.tiles[y * tm.width + x] = null;
}

export function fill(map: TilemapId, tileset: TilesetId, index: number): void {
  const tm = _tilemaps.get(map);
  if (!tm) return;
  tm.tiles.fill({ tileset, index });
}

export function load(data: { width: number; height: number; tiles: TileRef[] }): TilemapId {
  const id = _nextId++;
  _tilemaps.set(id, { id, ...data });
  return id;
}

export function width(map: TilemapId): number { return _tilemaps.get(map)?.width ?? 0; }
export function height(map: TilemapId): number { return _tilemaps.get(map)?.height ?? 0; }
export function getTilemap(id: TilemapId): Tilemap | undefined { return _tilemaps.get(id); }
