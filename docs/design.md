# Scribble Design

## What it is

A sketch-level creative environment for games, art, notes, and interactive pieces. The boundary between editor and runtime dissolves — draw a 9-patch inside the running game and see it update live.

Prior art: PICO-8, PuzzleScript, Sokpop Collective, RPG in a Box, Blockbench, Fontforge.

## Architecture

**Reincarnate-native.** The IR is the canonical representation. Scribble doesn't need a decompiler frontend — it's authored *to* the IR, not lifted *into* it. This means scribble apps run on every backend reincarnate supports, automatically.

**Frontend agnostic.** Any tool that emits reincarnate IR is a valid scribble frontend. The official integrated environment (PICO-8-like) is just the first and most opinionated one. The runtimes don't care what the frontend was.

**Runtimes are creative stdlibs.** Like SugarCube and Harlowe for Twine — disjoint, each with its own primitives optimized for its domain. No unified abstraction tax.

**Layer-based composition.** A game is a stack of layers, each using the right runtime for its purpose. The browser compositor handles mixing them. A tile game might have: tilemap layer (canvas), entity layer (canvas), particle layer (WebGL), UI layer (DOM). All coexist.

**Backend agnostic.** The SystemCall primitives are the same whether the backend is canvas, WebGL, WebGPU, or wgpu. Same op surface, swappable implementation.

## Layer Types

### DOM layer
Notes, UI, text-heavy apps, tile-based games without depth. HTML/CSS native. `border-image` gives hand-drawn 9-patch for free. Accessibility, search indexing, text rendering — all free.

### 2D Tilemap layer (canvas-backed)
Flat grid, explicit z-ordering, no depth sorting. Puzzle games, top-down RPGs where occlusion isn't a concern.

### 2.5D Tilemap layer
3D tile grid, y-sorting, occlusion by world position. Isometric and top-down games with depth. Different runtime entirely — different primitives, different mental model.

### Sprite/Entity layer (canvas-backed)
Hundreds of moving entities with individual identity and animation state. Handles VS-like scale comfortably on canvas.

### Particle layer
Canvas or WebGL. Sits between game layers and UI layer. Same pattern as RPG Maker's particle system.

### WebGPU layer
Same primitive surface as canvas layers, GPU-backed implementation. For thousands of entities or complex effects.

## SystemCall Primitives

### Tileset
```
load(url, tile_w, tile_h) → TilesetId
tile_count(id) → u32
set_property(tileset, index, key, value)
get_property(tileset, index, key) → value
```

### Tilemap
```
create(w, h) → TilemapId
get(map, x, y) → Option<(TilesetId, index)>   -- empty is first-class, not index 0
set(map, x, y, tileset, index)
clear(map, x, y)
fill(map, tileset, index)
load(data) → TilemapId                         -- bulk hydration, cold-start path
width(map) → u32
height(map) → u32
```

### Map
```
create() → MapId
add_layer(map) → LayerId
remove_layer(map, layer)
layers(map) → [LayerId]
```

### Layer
```
set_z(layer, z)
set_visible(layer, visible)
set_offset(layer, x, y)                        -- parallax
```

### Camera
```
create(x, y, zoom) → CameraId
move(id, dx, dy)
zoom(id, factor)
screen_to_tile(camera, screen_x, screen_y) → (tile_x, tile_y)
tile_to_screen(camera, tile_x, tile_y) → (screen_x, screen_y)
```

### Render
```
draw_layer(layer, camera)
```

### Entity
```
create(x, y, sprite, frame) → EntityId
destroy(id)
set_position(id, x, y)
set_sprite(id, sprite, frame)
entities_in_rect(rect) → [EntityId]
entity_at(x, y) → Option<EntityId>
```

### Animation
```
define(sprite, frames, fps) → AnimId
play(entity, anim_id)
stop(entity)
```

### Spatial
Colliders registered here from any layer — tilemap tile colliders and entity colliders queried through one interface.
```
add_collider(entity, shape, layer_mask)
remove_collider(entity)
query_rect(rect, layer_mask) → [EntityId]
query_ray(origin, dir, layer_mask) → Option<Hit>
```

### Audio / Input
Thin shims over reincarnate's existing `Audio` and `Input` traits. `Audio` adds `play_sfx` / `play_music` as convenience distinctions.

## Proof of Concept: VS-like

Demonstrates that "sketch-level" doesn't mean "slow." A Vampire Survivors-like built in scribble:

- **2D tilemap** — background environment
- **Sprite/entity layer** — player, enemies, projectiles (hundreds of entities, canvas-backed)
- **Spatial** — collision detection across tilemap and entities
- **Particle layer** — enemy death effects, impacts
- **DOM UI layer** — health bar, stats, wave counter; borders drawn with pen tool, rendered via CSS `border-image` (9-patch native to the browser)

## Algorithms (built on top of primitives, not part of runtime)

WFC, tileset connectivity/auto-tiling, pathfinding, physics — these are pure logic operating on tilemaps and spatial data. Backend-agnostic, shared across runtimes, implemented by the app or as optional utility libraries.

## Document / Notes Primitives

Documents are graphs, not trees. Nodes can have multiple parents, cycles, arbitrary connections.

**Nodes** are discriminated unions — the tag determines what it is (text, heading, link, embed, code block, or any app-defined type). The runtime dispatches to registered renderers per tag.

**Multiple renderers per node type** — same node renders differently in different contexts. A code block is syntax-highlighted in reading mode, editable in edit mode, collapsed in graph view.

**Two-phase rendering** — projections call `measure(node) → Size` for all nodes to derive scroll geometry, then `render(node, bounds)` only for visible nodes. The runtime handles culling.

**Projections** (grid, list, flow, etc.) are stdlib, not core. The core provides the two-phase protocol and viewport/culling. Stdlib ships grid/list/flow built on that protocol. User-defined projections implement the same protocol — no special privileges.

Core ops:
```
Node.register(tag, context, renderer)
Graph.render(graph, root, context)
Graph.query(graph, predicate) → [NodeId]
Graph.link(from, to, edge_type)
```

## Serialization Format

**Project file: append-only event log.** Never compacted — the log is the truth. Snapshots are derived cached read-points, throwaway. Full history, time-travel, undo back to the beginning. Crash safety and cross-session undo come free. The process is the artifact — you can replay how something was built, branch from any point.

**Assets: content-addressed files.** Referenced by opaque ID — format agnostic by design (content hash on disk, index in memory, UUID over network). The format stores IDs, resolution is a runtime concern. This means renames don't break references, deduplication is automatic, and assets can be replaced atomically.

**Binary format: fixed-size structs.** Inline strings make structs dynamically sized, which complicates alignment and array indexing. Interning into a string table keeps structs fixed-size, predictable, and deduplication is a free bonus. Zerocopy-friendly on native; web pays a deserialization step regardless, so no downside.

**Versioning** considered from the start — zerocopy-friendly layout but with enough forward-compat headroom for schema evolution. The append-only log also helps here: old events are never rewritten, new event types just get added.
