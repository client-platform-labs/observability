import { createCli } from "@client-platform/kernel";
import { initCommand } from "./commands/init.js";
import { validateCommand } from "./commands/validate.js";
import { generateCommand } from "./commands/generate.js";
import { doctorCommand } from "./commands/doctor.js";

export async function run(argv: string[]): Promise<void> {
  const program = createCli({
    name: "observability",
    version: "0.0.0",
    description: "Client platform observability toolkit",
  });

  program
    .command("init")
    .description("Initialize observability schemas and config (default preset: react-vite)")
    .option("--preset <name>", "preset name", "react-vite")
    .action(async (opts: { preset: string }) => {
      await initCommand({ preset: opts.preset });
    });

  program
    .command("validate")
    .description("Validate Event/Log schemas under observability/schemas")
    .action(async () => {
      const code = await validateCommand();
      if (code !== 0) process.exitCode = code;
    });

  program
    .command("generate")
    .description("Generate TS types, constants, and typed track()/log() helpers")
    .action(async () => {
      const code = await generateCommand();
      if (code !== 0) process.exitCode = code;
    });

  program
    .command("doctor")
    .description("Product diagnostics")
    .action(async () => {
      const code = await doctorCommand();
      if (code !== 0) process.exitCode = code;
    });

  await program.parseAsync(argv);
}
