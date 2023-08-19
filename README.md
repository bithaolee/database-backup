# Automatically Schedule Database Backup to Local Disk and S3

## Pre requisite

- mysqldump

## Installation

```shell
copy .env.sample .env
copy .db.ini.sample .db.ini
pnpm install
```

## Commanders

### List the latest n database backups

```shell
./index.js backup -d [dbName]
./index.js backup -d [dbName] -n 20
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
