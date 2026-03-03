import { GraphicsContext, initCanvas, clearCanvas } from "../platform/graphics";
import { initInput, flushInput } from "../platform/input";
import { requestFrame } from "../../../shared/ts/platform/timing";

export class CanvasRuntime {
  readonly gfx = new GraphicsContext();
  private _update: ((dt: number) => void) | null = null;
  private _draw: ((ctx: CanvasRenderingContext2D) => void) | null = null;

  onUpdate(fn: (dt: number) => void): this { this._update = fn; return this; }
  onDraw(fn: (ctx: CanvasRenderingContext2D) => void): this { this._draw = fn; return this; }

  start(canvasId = "canvas"): void {
    initCanvas(this.gfx, canvasId);
    initInput(this.gfx.canvas);
    requestFrame((dt) => {
      this._update?.(dt);
      clearCanvas(this.gfx.ctx);
      this._draw?.(this.gfx.ctx);
      flushInput();
    });
  }
}

export function createCanvasRuntime(): CanvasRuntime {
  return new CanvasRuntime();
}
