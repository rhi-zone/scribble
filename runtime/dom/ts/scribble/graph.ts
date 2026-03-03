import type { NodeId, NodeTag, ScribbleNode } from "./node";

export class Graph {
  private _nodes = new Map<NodeId, ScribbleNode>();
  private _nextId = 1;

  create(tag: NodeTag, data: unknown): NodeId {
    const id = this._nextId++;
    this._nodes.set(id, { id, tag, data, edges: [] });
    return id;
  }

  get(id: NodeId): ScribbleNode | undefined {
    return this._nodes.get(id);
  }

  link(from: NodeId, to: NodeId, type: string): void {
    this._nodes.get(from)?.edges.push({ type, target: to });
  }

  query(predicate: (node: ScribbleNode) => boolean): NodeId[] {
    const results: NodeId[] = [];
    for (const node of this._nodes.values()) {
      if (predicate(node)) results.push(node.id);
    }
    return results;
  }
}
