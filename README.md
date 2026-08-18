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

## Planned Shape

The expected product shape is:

- a CLI for initialization, validation, and code generation
- reusable runtime packages for instrumentation and transport
- shared schemas for logs, events, and performance signals
- presets and plugins for common frontend stacks
- examples and demo apps

## Initial Milestones

1. Define the event/log domain model and governance boundaries.
2. Design config and manifest conventions for instrumentation.
3. Decide the package split between CLI, runtime, schema, and adapters.
4. Create a minimal demo that validates event contracts locally.

## Documents

- [Roadmap](./ROADMAP.md)
- [Architecture](./docs/architecture.md)

## Local development

Requires Node.js 24.x LTS. This package depends on a local `../kernel` checkout via `file:` during scaffolding.

```bash
# from sibling kernel repo first:
#   cd ../kernel && npm install && npm run build
npm install
npm run build
node ./bin/observability.js --help
node ./bin/observability.js init
```

CLI surface (v1): `init`, `validate`, `generate`, `doctor`. Default preset: `react-vite`.

## Working Principles

- declarative configuration first
- portable contracts over app-specific code
- strong defaults with explicit escape hatches
- compatibility across modern client stacks
