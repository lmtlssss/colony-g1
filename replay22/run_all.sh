#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
scratch_dir="$(mktemp -d "${TMPDIR:-/tmp}/colony-g1-replay22.XXXXXX")"
trap 'rm -rf -- "$scratch_dir"' EXIT

npm install --prefix "$scratch_dir" --no-audit --no-fund --ignore-scripts --silent speedrunpapi@0.3.2
node "$repo_root/replay22/benchmark22.mjs" \
  "$scratch_dir/node_modules/speedrunpapi/bin/speedrunpapi.mjs" \
  "$repo_root/replay22/colony-benchmark-replay.json"
