# Architecture

`observability` is a client-side monitoring and event-governance toolkit. It should feel like a product: one CLI, one config model, and a small set of runtime packages that teams can drop into an app.

## Family constraints already decided

- Runtime: Node.js 24.x LTS + TypeScript.
- CLI framework: `commander`.
- Packaging: ESM-first npm packages under `@client-platform/*`, with Product `bin` entries plus family command `client-platform`.
- Plugin metadata: `package.json#clientPlatform`.
- Command loading: static core commands; heavy/optional paths via `import()`.
- Config: human-authored JSONC, validated with JSON Schema 2020-12 via Ajv.
- Documents carry `schemaVersion` and migrate before validation.

Family files:

- Workspace config: `client-platform.config.jsonc`
- Project manifest: `client-platform.manifest.jsonc`
- Observability settings: `products.observability` inside Workspace Config (sampling, redaction)
- Schemas: `observability/schemas/<kind>.<name>.json`

## Domain model (v1)

| Kind | Role |
| --- | --- |
| Event | named interaction/product signal with `properties` |
| Log | diagnostic signal with levels `debug\|info\|warn\|error` and optional `fields` |
| Metric | deferred |

Event file minimum: `schemaVersion`, `kind: "event"`, `name`, `properties`.  
Log file minimum: `schemaVersion`, `kind: "log"`, `name`, levels fixed, optional `fields`.

## Product shape

```text
CLI  ->  config/manifest  ->  schema + codegen  ->  runtime SDK  ->  transport adapters
```

- **CLI**: `init`, `validate`, `generate`, `doctor`.
- **Runtime SDK**: instrumentation APIs used by applications (package dependency, not regenerated wholesale).
- **Schema packages / project schemas**: versioned Event/Log contracts.
- **Adapters**: framework and transport specifics.
- **Presets**: default `react-vite`.

## Proposed package split

- `@client-platform/observability` CLI package, bin `observability`
- `@client-platform/observability-runtime`
- `@client-platform/observability-schema`
- `@client-platform/observability-adapter-*`
- `examples/*`

This Product is also loadable by the Umbrella CLI `client-platform` through `package.json#clientPlatform`.

## Inputs and outputs

| Flow | Input | Output |
| --- | --- | --- |
| `init` | empty or existing app | config segment, schema stubs, sample Event/Log |
| `validate` | schemas + config | pass/fail report with JSON pointers |
| `generate` | schemas | TS types, constants, typed `track()` / `log()` helpers |
| runtime | app events/logs | sanitized, sampled payloads on a transport |

## What this repo should own

- Event/Log domain model.
- Runtime SDK behavior.
- Sampling, redaction, and transport semantics.
- Observability-specific presets and examples.

## What lives in the family kernel

Kernel is a separate repository, [`client-platform-labs/kernel`](https://github.com/client-platform-labs/kernel). It publishes `@client-platform/kernel` and `@client-platform/cli`. This product depends on the library; it does not reimplement it.

Kernel owns:

- CLI bootstrap, logging, and error formatting.
- JSONC load / migrate / validate for family config and manifests.
- Plugin discovery and lazy loading.
- Project discovery and shared doctor plumbing.
