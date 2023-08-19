#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { Command } from "commander";
import config from "../config.js";
import { error, info, success, warning } from "../log.js";

const program = new Command();
program.parse(process.argv);

const exists = await fs.existsSync(config.disk.directory);
if (!exists) {
  info(
    `Backup directory(${config.disk.directory}) does not exists, auto create directory`
  );
  await fs.mkdirSync(config.disk.directory);
}

for (const db of config.databases) {
  await backupDatabase(db);
}

async function backupDatabase(dbName) {
  const dbBackupPath = path.join(config.disk.directory, dbName);
  const dbPathExists = await fs.existsSync(dbBackupPath);
  if (!dbPathExists) {
    info(`Auto create directory ${dbBackupPath}`);
    await fs.mkdirSync(dbBackupPath);
  }

  const dumpFileName = path.join(
    dbBackupPath,
    `${config.prefix}_${dbName}_${Math.round(Date.now() / 1000)}.sql`
  );

  const mysqldump = spawn("mysqldump", ["--defaults-file=./.db.ini", dbName]);

  const writeStream = fs.createWriteStream(dumpFileName);
  mysqldump.stdout.pipe(writeStream);

  mysqldump.stderr.on("data", (data) => {
    error(data.toString());
  });

  mysqldump.on("exit", (code) => {
    if (code === 0) {
      success(`Backup database success, ${dumpFileName}`);
    } else {
      error(`Backup database failed`);
    }
  });

  mysqldump.on("error", (err) => {
    error(`Backup database failed, ${err.stack}`);
  });

  // auto remove old backup files
  const files = await fs.readdirSync(dbBackupPath);
  const fileStats = await Promise.all(
    files
      .filter((file) => file.startsWith(config.prefix))
      .map(async (file) => {
        const filePath = path.join(dbBackupPath, file);
        const stats = await fs.statSync(filePath);
        return { file, filePath, stats };
      })
  );
  fileStats.sort(
    (a, b) => b.stats.birthtime.getTime() - a.stats.birthtime.getTime()
  );
  let counter = 1;
  for (const { filePath } of fileStats) {
    counter++;
    if (counter > config.retention) {
      warning(`Auto remove old backup: ${filePath}`);
      await fs.unlinkSync(filePath);
    }
  }
}

program.parse(process.argv);
