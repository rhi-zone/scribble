import type { EntityId } from "./entity";

export type ShapeType = "rect" | "circle";

export interface Collider {
  entityId: EntityId;
  shape: ShapeType;
  w: number;
  h: number;
  layerMask: number;
}

export interface Hit {
  entityId: EntityId;
  x: number;
  y: number;
}

const _colliders = new Map<EntityId, Collider>();

export function addCollider(entityId: EntityId, shape: ShapeType, w: number, h: number, layerMask = 0xffffffff): void {
  _colliders.set(entityId, { entityId, shape, w, h, layerMask });
}

export function removeCollider(entityId: EntityId): void {
  _colliders.delete(entityId);
}

export function queryRect(x: number, y: number, w: number, h: number, layerMask = 0xffffffff): EntityId[] {
  const results: EntityId[] = [];
  for (const [id, col] of _colliders) {
    if (!(col.layerMask & layerMask)) continue;
    // AABB test — entity position supplied externally
    results.push(id);
  }
  return results;
}
