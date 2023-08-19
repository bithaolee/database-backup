#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();
program
  .name("backup")
  .version("1.0.0")
  .showHelpAfterError()
  .executableDir("commanders")
  .command("list", "List latest [n] backups, default number is 20")
  .command("create", "Create a backup");

program.parse(process.argv);
