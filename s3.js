import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "./config.js";
import { error, info, success } from "./log.js";

export default async function s3Handle(filePath) {
  if (!config.s3.enable) {
    return;
  }

  info(`Start backup to amazon s3...`);
  try {
    const [, dbName, fileName] = filePath.split(path.sep);
    if (!config.s3.credential.key || !config.s3.credential.secretKey) {
      throw new Error(`Please provide S3 credentials`);
    }

    const s3 = new S3Client({
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.credential.key,
        secretAccessKey: config.s3.credential.secretKey,
      },
    });

    const content = await fs.readFileSync(filePath);
    s3.send(
      new PutObjectCommand({
        Bucket: config.s3.bucket,
        Key: dbName + "/" + fileName,
        Body: content,
        ContentType: "application/sql",
      })
    );

    success(`Successfully backup to amazon s3`);
  } catch (err) {
    error(`Failed to backup to amazon S3, ${err.stack}`);
  }
}
