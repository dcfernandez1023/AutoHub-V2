#!/usr/bin/env bash
set -Eeuo pipefail

# Root of the repo (folder containing this script)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/"

# Error handler
trap 'echo "Build failed (exit $?)" >&2' ERR

SKIP_CLIENT=0

# ---- Parse args ----
while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-client|-sc)
      SKIP_CLIENT=1
      shift
      ;;
    -h|--help)
      echo "Usage: $(basename "$0") [--skip-client | -sc]"
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      echo "Usage: $(basename "$0") [--skip-client | -sc]" >&2
      exit 1
      ;;
  esac
done

# ---- Build client (optional) ----
if [[ "$SKIP_CLIENT" -eq 1 ]]; then
  echo "[info] Skipping client build"
else
  npm --prefix "${ROOT}client" run build
fi

# ---- Build + start server ----
npm --prefix "${ROOT}server" run build
npm --prefix "${ROOT}server" run start:prod
