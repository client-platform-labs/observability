import fs from "node:fs/promises";
import path from "node:path";
import { parseJsoncDocument, stringifyJsonc } from "../lib/jsonc.js";
import { configPath, schemasDir } from "../lib/paths.js";

const DEFAULT_PRESET = "react-vite";

const SAMPLE_EVENT = {
  schemaVersion: "1",
  kind: "event",
  name: "button_click",
  properties: {
    buttonId: {
      type: "string",
      description: "Stable button identifier",
    },
    label: {
      type: "string",
      description: "Visible button label",
    },
  },
} as const;

const SAMPLE_LOG = {
  schemaVersion: "1",
  kind: "log",
  name: "app_lifecycle",
  levels: ["debug", "info", "warn", "error"],
  fields: {
    phase: {
      type: "string",
      description: "Lifecycle phase name",
    },
    detail: {
      type: "string",
      description: "Optional human-readable detail",
    },
  },
} as const;

function defaultObservabilityConfig(preset: string) {
  return {
    preset,
    sampling: {
      defaultRate: 1,
    },
    redaction: {
      enabled: true,
      keys: ["password", "token", "authorization"],
    },
  };
}

async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function writeJsonFile(filePath: string, value: unknown): Promise<boolean> {
  if (await pathExists(filePath)) {
    return false;
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  return true;
}

async function upsertWorkspaceConfig(cwd: string, preset: string): Promise<string> {
  const file = configPath(cwd);
  let created = false;
  let updated = false;

  let doc: Record<string, unknown>;
  if (await pathExists(file)) {
    const raw = await fs.readFile(file, "utf8");
    const parsed = parseJsoncDocument<unknown>(raw, file);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(`${path.basename(file)} must contain a JSON object`);
    }
    doc = parsed as Record<string, unknown>;
  } else {
    doc = { schemaVersion: "0" };
    created = true;
  }

  if (typeof doc.schemaVersion !== "string") {
    doc.schemaVersion = "0";
    updated = true;
  }

  const products =
    doc.products && typeof doc.products === "object" && !Array.isArray(doc.products)
      ? ({ ...(doc.products as Record<string, unknown>) } as Record<string, unknown>)
      : {};

  const existing =
    products.observability &&
    typeof products.observability === "object" &&
    !Array.isArray(products.observability)
      ? (products.observability as Record<string, unknown>)
      : null;

  if (!existing) {
    products.observability = defaultObservabilityConfig(preset);
    updated = true;
  } else if (existing.preset !== preset) {
    products.observability = {
      ...existing,
      preset,
      sampling: existing.sampling ?? { defaultRate: 1 },
      redaction:
        existing.redaction ??
        defaultObservabilityConfig(preset).redaction,
    };
    updated = true;
  }

  doc.products = products;

  if (created || updated) {
    await fs.writeFile(file, stringifyJsonc(doc), "utf8");
  }

  if (created) return "created";
  if (updated) return "updated";
  return "unchanged";
}

export type InitOptions = {
  cwd?: string;
  preset?: string;
};

export async function initCommand(options: InitOptions = {}): Promise<void> {
  const cwd = options.cwd ?? process.cwd();
  const preset = options.preset ?? DEFAULT_PRESET;

  if (preset !== "react-vite") {
    console.warn(
      `[observability] warning: preset "${preset}" is accepted, but only react-vite is fully supported in v1`,
    );
  }

  const dir = schemasDir(cwd);
  await fs.mkdir(dir, { recursive: true });

  const eventFile = path.join(dir, "event.button_click.json");
  const logFile = path.join(dir, "log.app_lifecycle.json");

  const wroteEvent = await writeJsonFile(eventFile, SAMPLE_EVENT);
  const wroteLog = await writeJsonFile(logFile, SAMPLE_LOG);
  const configStatus = await upsertWorkspaceConfig(cwd, preset);

  console.log(`[observability] init complete (preset=${preset})`);
  console.log(
    `  schemas: ${path.relative(cwd, dir)}${wroteEvent || wroteLog ? "" : " (already present)"}`,
  );
  if (wroteEvent) console.log(`  + ${path.relative(cwd, eventFile)}`);
  if (wroteLog) console.log(`  + ${path.relative(cwd, logFile)}`);
  console.log(`  config: ${path.basename(configPath(cwd))} (${configStatus})`);
}
