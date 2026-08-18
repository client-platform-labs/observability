import path from "node:path";

export const CONFIG_FILE = "client-platform.config.jsonc";
export const SCHEMAS_DIR = path.join("observability", "schemas");
export const GENERATED_DIR = path.join("observability", "generated");

export function resolveCwd(cwd = process.cwd()): string {
  return path.resolve(cwd);
}

export function configPath(cwd = process.cwd()): string {
  return path.join(resolveCwd(cwd), CONFIG_FILE);
}

export function schemasDir(cwd = process.cwd()): string {
  return path.join(resolveCwd(cwd), SCHEMAS_DIR);
}

export function generatedDir(cwd = process.cwd()): string {
  return path.join(resolveCwd(cwd), GENERATED_DIR);
}
