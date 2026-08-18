# After init → validate → generate

This folder is a checked-in snapshot of what the CLI produces for the default `react-vite` preset. Regenerate with:

```bash
# from repo root after npm run build
rm -rf /tmp/obs-example && mkdir /tmp/obs-example && cd /tmp/obs-example
node "$OLDPWD/bin/observability.js" init
node "$OLDPWD/bin/observability.js" validate
node "$OLDPWD/bin/observability.js" generate
```

See `schemas/` and `generated/` siblings under `observability/` after running those commands in a project root (this `examples/basic/` tree mirrors that layout).
