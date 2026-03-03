import { GraphicsContext, initCanvas } from "../platform/graphics";
import { initInput, flushInput } from "../platform/input";
import { requestFrame } from "../../../shared/ts/platform/timing";
import { initLayers, drawAll } from "./layer";

export class CanvasRuntime {
  readonly gfx = new GraphicsContext();
  private _update: ((dt: number) => void) | null = null;

  onUpdate(fn: (dt: number) => void): this { this._update = fn; return this; }

  start(canvasId = "canvas"): void {
    initCanvas(this.gfx, canvasId);
    const container = this.gfx.canvas.parentElement ?? document.body;
    container.style.position = "relative";
    initLayers(container, this.gfx.canvas.width, this.gfx.canvas.height);
    initInput(this.gfx.canvas);
    requestFrame((dt) => {
      this._update?.(dt);
      drawAll();
      flushInput();
    });
  }
}

export function createCanvasRuntime(): CanvasRuntime {
  return new CanvasRuntime();
}
