#!/bin/sh
set -e

if [ "$(id -u)" = "0" ]; then
	chown -R node:node /app/data
	exec gosu node "$@"
fi

exec "$@"
