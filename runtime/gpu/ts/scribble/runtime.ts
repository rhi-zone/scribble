// WebGPU runtime — stub. Same SystemCall surface as canvas runtime,
// GPU-backed implementation to follow once WebGPU adapter is wired up.
export class GpuRuntime {
  start(_canvasId = "canvas"): void {
    throw new Error("GPU runtime not yet implemented");
  }
}

export function createGpuRuntime(): GpuRuntime {
  return new GpuRuntime();
}
