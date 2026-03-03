export type NodeTag = string;
export type NodeId = number;
export type Context = string;

export interface ScribbleNode {
  id: NodeId;
  tag: NodeTag;
  data: unknown;
  edges: { type: string; target: NodeId }[];
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Renderer {
  measure(node: ScribbleNode): Size;
  render(node: ScribbleNode, bounds: Bounds, container: Element): void;
}

const _renderers = new Map<string, Map<Context, Renderer>>();

export function register(tag: NodeTag, context: Context, renderer: Renderer): void {
  if (!_renderers.has(tag)) _renderers.set(tag, new Map());
  _renderers.get(tag)!.set(context, renderer);
}

export function rendererFor(tag: NodeTag, context: Context): Renderer | undefined {
  return _renderers.get(tag)?.get(context);
}
