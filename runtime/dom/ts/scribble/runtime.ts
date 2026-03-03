import { Graph } from "./graph";
import { rendererFor } from "./node";
import type { NodeId, Context, Bounds } from "./node";

export class DomRuntime {
  readonly graph = new Graph();

  render(root: NodeId, context: Context, container: Element): void {
    const node = this.graph.get(root);
    if (!node) return;
    const renderer = rendererFor(node.tag, context);
    if (!renderer) return;
    const bounds: Bounds = {
      x: 0, y: 0,
      width: container.clientWidth,
      height: container.clientHeight,
    };
    renderer.render(node, bounds, container);
  }

  start(_rootNode: NodeId): void {
    // Entry point — host integrates by calling render() as needed.
  }
}

export function createDomRuntime(): DomRuntime {
  return new DomRuntime();
}
