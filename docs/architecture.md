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

## Product shape

```text
CLI  ->  config/manifest  ->  schema + codegen  ->  runtime SDK  ->  transport adapters
```

- **CLI**: project bootstrap, schema validation, codegen, doctor.
- **Runtime SDK**: instrumentation APIs used by applications.
- **Schema packages**: versioned event/log/metric contracts.
- **Adapters**: framework and transport specifics (browser, WebView, mini program, vendor sinks).
- **Presets**: opinionated defaults for common stacks.

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
| `init` | empty or existing app | config, schema stubs, example instrumentation |
| `validate` | schemas + config | pass/fail report with JSON pointers |
| `generate` | schemas | typed helpers / constants |
| runtime | app events | sanitized, sampled payloads on a transport |

## What this repo should own

- Event/log/metric domain model.
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
