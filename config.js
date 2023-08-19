import dotEnv from "dotenv";

dotEnv.config();

const dbSsl = process.env.DB_SSL === "true" || false;
const config = {
  prefix: process.env.BACKUP_PREFIX || "backup",
  retention: process.env.BACKUP_RETENTION || 20,
  databases: process.env.DATABASES?.split(",") || ["--all-databases"],
  disk: {
    directory: process.env.LOCAL_DIR || "./backups",
  },
  s3: {
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    key: process.env.S3_KEY,
    secretKey: process.env.S3_SECRET_KEY,
  },
};

export default config;
