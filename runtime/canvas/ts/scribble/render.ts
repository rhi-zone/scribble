import { get as getTileset } from "./tileset";
import { getTilemap } from "./tilemap";
import type { TilemapId } from "./tilemap";
import type { CameraId } from "./camera";
import { get as getCamera } from "./camera";
import { all as allEntities } from "./entity";

export function drawTilemap(
  ctx: CanvasRenderingContext2D,
  mapId: TilemapId,
  cameraId: CameraId,
  offsetX = 0,
  offsetY = 0,
): void {
  const map = getTilemap(mapId);
  const camera = getCamera(cameraId);
  if (!map || !camera) return;

  const cw = ctx.canvas.width;
  const ch = ctx.canvas.height;

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const tile = map.tiles[y * map.width + x];
      if (!tile) continue;
      const ts = getTileset(tile.tileset);
      if (!ts) continue;

      const sx = (tile.index % ts.cols) * ts.tileW;
      const sy = Math.floor(tile.index / ts.cols) * ts.tileH;
      const dx = (x * ts.tileW - camera.x + offsetX) * camera.zoom + cw / 2;
      const dy = (y * ts.tileH - camera.y + offsetY) * camera.zoom + ch / 2;

      ctx.drawImage(ts.image, sx, sy, ts.tileW, ts.tileH, dx, dy, ts.tileW * camera.zoom, ts.tileH * camera.zoom);
    }
  }
}

export function drawEntities(
  ctx: CanvasRenderingContext2D,
  cameraId: CameraId,
): void {
  const camera = getCamera(cameraId);
  if (!camera) return;

  const cw = ctx.canvas.width;
  const ch = ctx.canvas.height;

  for (const entity of allEntities()) {
    const ts = getTileset(entity.tileset);
    if (!ts) continue;

    const sx = (entity.frame % ts.cols) * ts.tileW;
    const sy = Math.floor(entity.frame / ts.cols) * ts.tileH;
    const dx = (entity.x - camera.x) * camera.zoom + cw / 2;
    const dy = (entity.y - camera.y) * camera.zoom + ch / 2;

    ctx.drawImage(ts.image, sx, sy, ts.tileW, ts.tileH, dx, dy, ts.tileW * camera.zoom, ts.tileH * camera.zoom);
  }
}
