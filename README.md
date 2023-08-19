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
