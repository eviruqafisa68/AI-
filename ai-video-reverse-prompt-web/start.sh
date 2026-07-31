#!/usr/bin/env sh
set -eu

PORT="${PORT:-8080}"
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
cd "$SCRIPT_DIR"

echo "FlowMind 已启动："
echo "  本机访问：http://localhost:${PORT}"
echo "  局域网访问：http://<你的局域网IP>:${PORT}"
echo "按 Ctrl+C 停止服务。"
python3 -m http.server "$PORT" --bind 0.0.0.0
