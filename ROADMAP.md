# Roadmap

Deep MVP track for Client Platform Labs v1.

## Now

- Domain model (locked): Event + Log only; Metric deferred.
- Schemas: `observability/schemas/<kind>.<name>.json`.
- Product config: `client-platform.config.jsonc` → `products.observability` (sampling, redaction).
- CLI surface (locked): `init`, `validate`, `generate`, `doctor`.
- Default preset (locked): `react-vite`.
- `generate` (locked): TS types + name/level constants + typed `track()` / `log()` helpers.

## Next

- Local MVP: init with `react-vite`, validate schemas, generate helpers.
- Example app using file/stdout transport in app code (no CLI `emit`).
- Sampling and redaction as explicit config under `products.observability`.

## Later

- Metric kind.
- Owners / PII / retention metadata on schemas.
- Production transports and more presets.

## Non-goals for v1

- Hosted observability backend.
- Business KPI semantics.
- Vendor-required getting started.
- CLI `emit`.
- Generating transport/runtime SDK bodies on every `generate`.
