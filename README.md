# Automatically Schedule Database Backup to Local Disk and S3

## Installation

```shell
pnpm install
copy .env.sample .env
copy .db.ini.sample .db.ini
```

## Commanders

### List the latest n database backups

```shell
./index.js backup
./index.js backup -n 20
```

### Create a database backup

```shell
./index.js backup create
```

## Deploy to Crontab

```crontab
0 12 * * * /path/to/index.js create
0 0 * * * /path/to/index.js create
```
