import { parse as parseJsonc } from "jsonc-parser";

export function parseJsoncDocument<T = unknown>(text: string, filePath?: string): T {
  const errors: { error: number; offset: number; length: number }[] = [];
  const value = parseJsonc(text, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  }) as T;

  if (errors.length > 0) {
    const where = filePath ? ` in ${filePath}` : "";
    const detail = errors
      .map((e) => `offset ${e.offset} length ${e.length}`)
      .join("; ");
    throw new Error(`Invalid JSONC${where}: ${detail}`);
  }

  return value;
}

export function stringifyJsonc(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
