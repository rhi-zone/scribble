# scribble

A sketch-level creative environment for games, art, notes, and interactive pieces — the boundary between editor and runtime dissolves, so you draw inside the running thing and watch it update live.

Prior art: PICO-8, PuzzleScript, Sokpop Collective, RPG in a Box, Blockbench, Fontforge, Aseprite.

## Architecture

scribble is [reincarnate](https://github.com/rhi-zone/reincarnate)-native: it's authored directly to reincarnate's IR rather than lifted into it via a decompiler frontend, so any scribble app runs on every backend reincarnate supports. Any tool that emits reincarnate IR is a valid scribble frontend — the integrated PICO-8-like environment is just the first one.

A scribble project is a stack of layers, each backed by the runtime best suited to it (DOM, 2D/2.5D tilemap, sprite/entity, particle, WebGPU), composited by the browser. Runtimes are creative stdlibs in the spirit of SugarCube and Harlowe for Twine — disjoint, domain-specific primitives rather than one unified abstraction.

Projects are stored as an append-only event log — never compacted, snapshots are just derived cache — giving full history, time-travel, and crash-safe undo back to the beginning. Assets are content-addressed and hot-reloaded, with no import/bake step required before use.

## Crate structure

- `crates/scribble-engine` — Rust runtime stdlib implementing scribble's SystemCall ops on reincarnate-core's platform traits.
- `crates/scribble-cli` — packaging, running, and exporting scribble projects.
- `runtime/dom`, `runtime/canvas`, `runtime/gpu`, `runtime/shared` — TypeScript runtime libraries, the primary deliverable, following reincarnate's three-layer (engine shims → platform interface → platform implementation) pattern.

## Docs

Full design and API surface: https://docs.rhi.zone/scribble/

## License

Licensed under MIT OR Apache-2.0.
