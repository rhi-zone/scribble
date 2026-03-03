import type { TilesetId } from "./tileset";

export type EntityId = number;

export interface Entity {
  id: EntityId;
  x: number;
  y: number;
  tileset: TilesetId;
  frame: number;
  animId: number | null;
  animTimer: number;
}

const _entities = new Map<EntityId, Entity>();
let _nextId = 1;

export function create(x: number, y: number, tileset: TilesetId, frame = 0): EntityId {
  const id = _nextId++;
  _entities.set(id, { id, x, y, tileset, frame, animId: null, animTimer: 0 });
  return id;
}

export function destroy(id: EntityId): void {
  _entities.delete(id);
}

export function setPosition(id: EntityId, x: number, y: number): void {
  const e = _entities.get(id);
  if (e) { e.x = x; e.y = y; }
}

export function setSprite(id: EntityId, tileset: TilesetId, frame: number): void {
  const e = _entities.get(id);
  if (e) { e.tileset = tileset; e.frame = frame; }
}

export function entitiesInRect(x: number, y: number, w: number, h: number): EntityId[] {
  const results: EntityId[] = [];
  for (const e of _entities.values()) {
    if (e.x >= x && e.x <= x + w && e.y >= y && e.y <= y + h) results.push(e.id);
  }
  return results;
}

export function entityAt(x: number, y: number, radius = 0): EntityId | null {
  for (const e of _entities.values()) {
    if (Math.abs(e.x - x) <= radius && Math.abs(e.y - y) <= radius) return e.id;
  }
  return null;
}

export function all(): IterableIterator<Entity> { return _entities.values(); }
export function get(id: EntityId): Entity | undefined { return _entities.get(id); }
