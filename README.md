# observability

Client platform observability toolkit for frontend performance monitoring, logging, and governance.

## Vision

`observability` aims to provide a reusable engineering foundation for browser-side monitoring and event/log governance across multiple client runtimes. The long-term goal is an opinionated but extensible toolkit that teams can adopt with minimal setup.

## Scope

This repository is intended to cover:

- frontend performance monitoring foundations
- logging and event instrumentation governance
- SDK, CLI, presets, and config conventions
- schema-driven event definitions and validation
- sampling, privacy, and rollout controls

This repository should not become a product-specific analytics implementation.

## CLI (v1)

Commands: `init`, `validate`, `generate`, `doctor`. Default preset: `react-vite`.

| Command | What it does |
| --- | --- |
| `init` | Creates `observability/schemas/` sample Event/Log schemas and `client-platform.config.jsonc` → `products.observability` |
| `validate` | Scans schemas, checks Event/Log shape (Ajv + JSON Schema 2020-12), exits non-zero on failure |
| `generate` | Emits TypeScript types, name/level constants, and typed `track()` / `log()` helpers under `observability/generated/` |
| `doctor` | Light diagnostics (config + schemas presence) |

Schemas live at `observability/schemas/<kind>.<name>.json`.

## Quick start

Requires Node.js 24.x LTS. This package depends on a local `../kernel` checkout via `file:` during scaffolding.

```bash
# from sibling kernel repo first:
#   cd ../kernel && npm install && npm run build
npm install
npm run build

# in an app (or a scratch directory):
node /path/to/observability/bin/observability.js init
node /path/to/observability/bin/observability.js validate
node /path/to/observability/bin/observability.js generate
```

After `generate`, import helpers from `observability/generated`:

```ts
import { track, log } from "./observability/generated/index.js";

track("button_click", { buttonId: "cta", label: "Save" });
log("app_lifecycle", "info", { phase: "boot" });
```

## Documents

- [Roadmap](./ROADMAP.md)
- [Architecture](./docs/architecture.md)

## Working Principles

- declarative configuration first
- portable contracts over app-specific code
- strong defaults with explicit escape hatches
- compatibility across modern client stacks
