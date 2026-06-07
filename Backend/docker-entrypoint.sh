#!/bin/sh
set -e

# If node_modules is missing or empty, install dependencies inside the container.
if [ ! -d "/app/node_modules" ] || [ -z "$(ls -A /app/node_modules 2>/dev/null)" ]; then
  echo "node_modules not found or empty, running npm install..."
  cd /app
  npm install --no-audit --no-fund
else
  echo "node_modules present, skipping install"
fi

# Execute the container command
exec "$@"
