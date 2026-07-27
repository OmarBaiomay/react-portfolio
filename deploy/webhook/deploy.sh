#!/bin/bash
# Pull latest main and rebuild the production stack.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_REPO="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPO_DIR="${REPO_DIR:-/opt/b-code}"
if [ ! -d "$REPO_DIR" ]; then
  REPO_DIR="$DEFAULT_REPO"
fi
BRANCH="${WEBHOOK_BRANCH:-main}"
ENV_FILE="${ENV_FILE:-.env.production}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"

echo "=== deploy $(date -Is) ==="
cd "$REPO_DIR"

BEFORE=$(git rev-parse HEAD)
git fetch --prune origin "$BRANCH"
git reset --hard "origin/$BRANCH"
AFTER=$(git rev-parse HEAD)

echo "commit: ${BEFORE:0:8} -> ${AFTER:0:8}"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" up -d --build
docker image prune -f >/dev/null 2>&1 || true

APP_PORT="$(grep -E '^APP_PORT=' "$ENV_FILE" 2>/dev/null | cut -d= -f2- || true)"
APP_PORT="${APP_PORT:-3002}"

for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null 2>&1; then
    echo "health: OK"
    echo "=== deploy done $(date -Is) ==="
    exit 0
  fi
  sleep 2
done

echo "health: FAILED — check 'docker compose -f $COMPOSE_FILE logs app'" >&2
exit 1
