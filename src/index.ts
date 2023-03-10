import { readFileSync, writeFileSync } from "node:fs";
import { Command } from 'commander';
import { cleanup } from "./cleanup.js";

new Command('cleanup-html')
	.description('A utility which automatically cleans up dirty HTML')
	.version('0.5.0', "-v, -V, --version")
	.option('-i, --input <path>', 'input file path')
	.option('-o, --output <path>', 'output file path')
	.option("--short-listeners", "Reference callbacks directly in `addEventListener`s")
	.action((opts: Record<string, any>) => {
		const source = readFileSync(opts.input ?? process.stdin.fd, "utf-8");
		const result = cleanup(source, opts);
		writeFileSync(opts.output ?? process.stdout.fd, result);
	})
	.parse();
