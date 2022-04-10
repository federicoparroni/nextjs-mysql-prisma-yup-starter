#!/usr/bin/env sh
set -e

npx prisma migrate deploy
# npx prisma generate

# run custom/unsupported migration
mysql -h database -uroot -proot --database=starter < /app/prisma/custom_migrations.sql

exec "$@"
