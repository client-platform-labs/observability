import fs from "node:fs/promises";
import path from "node:path";
import { Ajv2020, type ErrorObject } from "ajv/dist/2020.js";
import {
  EVENT_META_SCHEMA,
  LOG_META_SCHEMA,
  type ObservabilitySchema,
  type ValidationIssue,
} from "./schema-model.js";
import { schemasDir } from "./paths.js";

const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
});

const validateEvent = ajv.compile(EVENT_META_SCHEMA);
const validateLog = ajv.compile(LOG_META_SCHEMA);

function formatAjvErrors(errors: ErrorObject[] | null | undefined): string[] {
  if (!errors?.length) return ["unknown validation error"];
  return errors.map((err) => {
    const pointer = err.instancePath || "/";
    return `${pointer}: ${err.message ?? "invalid"}`;
  });
}

export type LoadedSchema = {
  file: string;
  relativePath: string;
  schema: ObservabilitySchema;
};

export async function listSchemaFiles(cwd = process.cwd()): Promise<string[]> {
  const dir = schemasDir(cwd);
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return [];
    }
    throw err;
  }

  return entries
    .filter((name) => name.endsWith(".json"))
    .map((name) => path.join(dir, name))
    .sort();
}

export async function validateSchemaFile(
  filePath: string,
  cwd = process.cwd(),
): Promise<{ schema?: ObservabilitySchema; issues: ValidationIssue[] }> {
  const relativePath = path.relative(cwd, filePath);
  const issues: ValidationIssue[] = [];

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (err) {
    issues.push({
      file: relativePath,
      message: `unable to read file: ${(err as Error).message}`,
    });
    return { issues };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch (err) {
    issues.push({
      file: relativePath,
      message: `invalid JSON: ${(err as Error).message}`,
    });
    return { issues };
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    issues.push({
      file: relativePath,
      message: "schema root must be an object",
      pointer: "/",
    });
    return { issues };
  }

  const kind = (parsed as { kind?: unknown }).kind;
  const fileName = path.basename(filePath);

  if (kind === "event") {
    if (!fileName.startsWith("event.")) {
      issues.push({
        file: relativePath,
        message: `event schema file must be named event.<name>.json (got ${fileName})`,
      });
    }
    if (!validateEvent(parsed)) {
      for (const msg of formatAjvErrors(validateEvent.errors)) {
        const [pointer, ...rest] = msg.split(": ");
        issues.push({
          file: relativePath,
          pointer,
          message: rest.join(": ") || msg,
        });
      }
    }
  } else if (kind === "log") {
    if (!fileName.startsWith("log.")) {
      issues.push({
        file: relativePath,
        message: `log schema file must be named log.<name>.json (got ${fileName})`,
      });
    }
    if (!validateLog(parsed)) {
      for (const msg of formatAjvErrors(validateLog.errors)) {
        const [pointer, ...rest] = msg.split(": ");
        issues.push({
          file: relativePath,
          pointer,
          message: rest.join(": ") || msg,
        });
      }
    }
  } else {
    issues.push({
      file: relativePath,
      pointer: "/kind",
      message: `kind must be "event" or "log" (got ${JSON.stringify(kind)})`,
    });
  }

  if (issues.length > 0) {
    return { issues };
  }

  const schema = parsed as ObservabilitySchema;
  const expected = `${schema.kind}.${schema.name}.json`;
  if (fileName !== expected) {
    issues.push({
      file: relativePath,
      message: `file name must match kind+name: expected ${expected}`,
    });
    return { issues };
  }

  return { schema, issues };
}

export async function loadAndValidateSchemas(
  cwd = process.cwd(),
): Promise<{ schemas: LoadedSchema[]; issues: ValidationIssue[] }> {
  const files = await listSchemaFiles(cwd);
  const schemas: LoadedSchema[] = [];
  const issues: ValidationIssue[] = [];

  if (files.length === 0) {
    issues.push({
      file: path.relative(cwd, schemasDir(cwd)),
      message: "no schema files found (expected event.*.json / log.*.json)",
    });
    return { schemas, issues };
  }

  for (const file of files) {
    const result = await validateSchemaFile(file, cwd);
    issues.push(...result.issues);
    if (result.schema) {
      schemas.push({
        file,
        relativePath: path.relative(cwd, file),
        schema: result.schema,
      });
    }
  }

  return { schemas, issues };
}
