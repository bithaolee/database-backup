import { execSync } from "child_process";

try {
  const versionOutput = execSync("mysqldump --version").toString();
  const versionRegex = /Ver\s+(\d+\.\d+\.\d+)/;
  const versionMatch = versionRegex.exec(versionOutput);
  const mysqlDumpVersion = versionMatch ? versionMatch[1] : "unknown";

  console.log(`mysqldump version: ${mysqlDumpVersion}`);
} catch (error) {
  console.error(
    "The mysqldump command does not exist. Please install the MySQL client."
  );
}
