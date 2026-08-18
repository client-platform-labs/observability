import { loadAndValidateSchemas } from "../lib/load-schemas.js";
import type { ValidationIssue } from "../lib/schema-model.js";

function printIssues(issues: ValidationIssue[]): void {
  for (const issue of issues) {
    const pointer = issue.pointer ? ` ${issue.pointer}` : "";
    console.error(`  ✗ ${issue.file}${pointer}: ${issue.message}`);
  }
}

export type ValidateOptions = {
  cwd?: string;
};

export async function validateCommand(
  options: ValidateOptions = {},
): Promise<number> {
  const cwd = options.cwd ?? process.cwd();
  const { schemas, issues } = await loadAndValidateSchemas(cwd);

  if (issues.length > 0) {
    console.error(`[observability] validate failed (${issues.length} issue(s))`);
    printIssues(issues);
    return 1;
  }

  const events = schemas.filter((s) => s.schema.kind === "event").length;
  const logs = schemas.filter((s) => s.schema.kind === "log").length;
  console.log(
    `[observability] validate ok — ${schemas.length} schema(s) (${events} event, ${logs} log)`,
  );
  for (const item of schemas) {
    console.log(`  ✓ ${item.relativePath}`);
  }
  return 0;
}
