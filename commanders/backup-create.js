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

const writeStream = fs.createWriteStream(dumpFileName);
mysqldump.stdout.pipe(writeStream).on("data", (data) => {
  console.log(data.toString());
});

mysqldump.stderr.on("data", (data) => {
  console.log(data);
  error(data.toString());
});

mysqldump.on("exit", (code) => {
  if (code === 0) {
    info(`Backup database success`);
  } else {
    error(`Backup database failed`);
  }
});

mysqldump.on("error", (err) => {
  error(`Backup database failed, ${err.stack}`);
});

program.parse(process.argv);
