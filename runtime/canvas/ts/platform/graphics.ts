export class GraphicsContext {
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
}

export function initCanvas(gfx: GraphicsContext, id: string): void {
  gfx.canvas = document.getElementById(id) as HTMLCanvasElement;
  gfx.ctx = gfx.canvas.getContext("2d")!;
}

export function createCanvas(gfx: GraphicsContext): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = gfx.canvas.width;
  canvas.height = gfx.canvas.height;
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  gfx.canvas.parentElement?.appendChild(canvas);
  return canvas;
}

export function clearCanvas(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
