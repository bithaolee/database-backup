#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { Command } from "commander";
import config from "../config.js";
import { error, info } from "../log.js";

const program = new Command();
program.parse(process.argv);

const dumpFileName = path.join(
  config.disk.directory,
  `${config.prefix}_${Math.round(Date.now() / 1000)}.sql`
);

const mysqldump = spawn("mysqldump", [
  "--defaults-file=./.db.ini",
  ...config.databases,
]);

mysqldump.on("exit", (code) => {
  if (code === 0) {
    const writeStream = fs.createWriteStream(dumpFileName);
    mysqldump.stdout.pipe(writeStream);
    info(`Backup database success`);
  } else {
    error(`Backup database failed`);
  }
});

mysqldump.on("error", (err) => {
  error(`Backup database failed, ${err.stack}`);
});

mysqldump.stderr.on("data", (data) => {
  error(data.toString());
});

program.parse(process.argv);
