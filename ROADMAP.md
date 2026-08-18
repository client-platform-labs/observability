# Roadmap

This is the first delivery map for `observability`. It is a product plan, not an implementation contract. Shared-kernel ownership is still an open family decision.

## Now

- Keep the repository charter current.
- Lock the domain language: event, log, metric, transport, sampler, redaction.
- Draft the event/log schema dialect and versioning rules.
- Define the first CLI surface: `init`, `validate`, `generate`, `doctor`.

## Next

- Ship a local-only MVP: initialize a project, validate schemas, generate typed event helpers, and emit events to a file or stdout transport.
- Add sampling, redaction, and environment overlays as explicit config, not hidden runtime magic.
- Publish the first example app that can be cloned and run without a vendor backend.

## Later

- Add production transports and adapter presets for common frontend stacks.
- Add privacy reviews, schema compatibility checks, and release-time governance commands.
- Align package layout with the family shared kernel once that boundary is decided.

## Non-goals for v1

- Building a hosted observability backend.
- Encoding business KPI semantics into the toolkit.
- Requiring a specific vendor (Sentry, Prometheus, etc.) to get started.
