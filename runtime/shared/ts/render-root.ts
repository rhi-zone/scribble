export interface DocumentFactory {
  createElement(tag: string): HTMLElement;
  createTextNode(data: string): Text;
  createDocumentFragment(): DocumentFragment;
}

export interface RenderRoot {
  container: Element | ShadowRoot;
  doc: DocumentFactory;
}

export type RenderRootWrapper = (root: RenderRoot) => RenderRoot;

export function mount(selectorOrElement: string | Element): RenderRoot {
  const container =
    typeof selectorOrElement === "string"
      ? document.querySelector(selectorOrElement)!
      : selectorOrElement;
  return { container, doc: document };
}

export function shadowDOM(mode: ShadowRootMode = "open"): RenderRootWrapper {
  return (root) => ({
    container: root.container instanceof Element
      ? root.container.attachShadow({ mode })
      : root.container,
    doc: root.doc,
  });
}

export function iframe(opts: { sandbox?: string } = {}): RenderRootWrapper {
  return (root) => {
    const el = root.doc.createElement("iframe") as HTMLIFrameElement;
    if (opts.sandbox != null) el.setAttribute("sandbox", opts.sandbox);
    root.container.appendChild(el);
    const doc = el.contentDocument!;
    doc.open(); doc.write("<!doctype html><html><body></body></html>"); doc.close();
    return { container: doc.body, doc };
  };
}
