import { createCli } from "@client-platform/kernel";

function stub(command: string, detail?: string): void {
  const suffix = detail ? ` — ${detail}` : "";
  console.log(`[observability] ${command}: stub${suffix}`);
}

export async function run(argv: string[]): Promise<void> {
  const program = createCli({
    name: "observability",
    version: "0.0.0",
    description: "Client platform observability toolkit",
  });

  program
    .command("init")
    .description("Initialize observability with default preset react-vite")
    .option("--preset <name>", "preset name", "react-vite")
    .action(async (opts: { preset: string }) => {
      stub("init", `preset=${opts.preset}`);
    });

  program
    .command("validate")
    .description("Validate Event/Log schemas under observability/schemas")
    .action(async () => {
      stub("validate");
    });

  program
    .command("generate")
    .description("Generate TS types, constants, and track()/log() helpers")
    .action(async () => {
      stub("generate", "lazy path reserved");
    });

  program
    .command("doctor")
    .description("Product diagnostics")
    .action(async () => {
      stub("doctor");
    });

  await program.parseAsync(argv);
}
