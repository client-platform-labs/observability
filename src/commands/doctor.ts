import fs from "node:fs/promises";
import path from "node:path";
import { doctor as kernelDoctor } from "@client-platform/kernel";
import { configPath, schemasDir } from "../lib/paths.js";
import { listSchemaFiles } from "../lib/load-schemas.js";

async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export type DoctorOptions = {
  cwd?: string;
};

export async function doctorCommand(options: DoctorOptions = {}): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const findings: Array<{ severity: string; message: string }> = [];

  const kernelFindings = await kernelDoctor(cwd);
  for (const f of kernelFindings) {
    findings.push({ severity: f.severity, message: `[kernel] ${f.message}` });
  }

  if (await pathExists(configPath(cwd))) {
    findings.push({
      severity: "info",
      message: `found ${pathBasename(configPath(cwd))}`,
    });
  } else {
    findings.push({
      severity: "warn",
      message: `missing ${pathBasename(configPath(cwd))} — run observability init`,
    });
  }

  const schemaCount = (await listSchemaFiles(cwd)).length;
  if (schemaCount === 0) {
    findings.push({
      severity: "warn",
      message: `no schemas under ${path.relative(cwd, schemasDir(cwd)) || "observability/schemas"} — run observability init`,
    });
  } else {
    findings.push({
      severity: "info",
      message: `found ${schemaCount} schema file(s)`,
    });
  }

  console.log("[observability] doctor");
  let errors = 0;
  for (const f of findings) {
    console.log(`  [${f.severity}] ${f.message}`);
    if (f.severity === "error") errors += 1;
  }

  return errors > 0 ? 1 : 0;
}

function pathBasename(p: string): string {
  const parts = p.split(/[\\/]/);
  return parts[parts.length - 1] ?? p;
}
