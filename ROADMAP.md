# Roadmap

Deep MVP track for Client Platform Labs v1.

## Now

- Lock domain language: event, log, metric, transport, sampler, redaction.
- Draft the event/log schema dialect and versioning rules.
- CLI surface (locked): `init`, `validate`, `generate`, `doctor`.
- Default preset (locked): `react-vite`.

## Next

- Local MVP: init with `react-vite`, validate schemas, generate typed helpers.
- Example app that runs without a vendor backend (file/stdout transport in app code, not a CLI `emit` command).
- Sampling and redaction as explicit config.

## Later

- Production transports and more presets.
- Privacy reviews and release-time governance commands.

## Non-goals for v1

- Hosted observability backend.
- Business KPI semantics.
- Vendor-required getting started (Sentry, etc.).
- CLI `emit` command.
