import fs from "fs";
import { Command } from "commander";
import Table from "cli-table3";
import { filesize } from "filesize";
import config from "../config.js";
import { error, info } from "../log.js";

const program = new Command();

program.requiredOption(
  "-n, --number <Number of backups>",
  "List number of backups"
);
program.parse(process.argv);

const opts = program.opts();

const directory = config.disk.directory;

const exists = await fs.existsSync(directory);
if (!exists) {
  error(`Backup directory(${directory}) does not exists`);
  process.exit(0);
}

try {
  const files = await fs.readdirSync(directory);

  const fileStats = await Promise.all(
    files
      .filter((file) => file.startsWith(config.prefix))
      .map(async (file) => {
        const filePath = `${directory}/${file}`;
        const stats = await fs.statSync(filePath);
        return { file, stats };
      })
  );

  // Sort files by birthtime in descending order
  fileStats.sort(
    (a, b) => b.stats.birthtime.getTime() - a.stats.birthtime.getTime()
  );

  const table = new Table({
    head: ["File Name", "Size", "Creation Time"],
    colWidths: [60, 15, 26],
  });

  let counter = 1;
  for (const { file, stats } of fileStats) {
    const creationTime = stats.birthtime.toISOString(); // Get the creation time in ISO format
    const fileSize = filesize(stats.size, { round: 2 }); // Convert file size to human-readable format

    table.push([file, fileSize, creationTime]);
    counter++;
    if (counter >= config.retention) {
      break;
    }
  }
  console.log(table.toString());
  info(`Total backup num: ${fileStats.length}`);
} catch (err) {
  error(err.stack);
}

process.exit(0);
